const ThirdParty = require('../models/third-party'),
  User = require('../models/user'),
  Artist = require('../models/artist'),
  Genre = require('../models/genre'),
  Track = require('../models/track'),
  config = require('../config/config'),
  spotifyResolver = require('../lib/spotify-resolver'),
	{ upperCaser } = require('../utils');

const promise = require('bluebird'),
  moment = require('moment');

const rp = require('request-promise');

module.exports.createThirdParty = (options) => ThirdParty.create(options)
  .then((thirdParty) => User.withProfile(thirdParty.userId, 'thirdParties:'));

module.exports.updateThirdParty = function updateThirdParty(thirdPartyId, updateInfo, correlationId) {
  return ThirdParty.update(thirdPartyId, updateInfo, correlationId);
}

module.exports.deleteThirdParty = (userId, thirdPartyId) => User.withProfile(userId, 'thirdParties:').then(user => {
  if (!user) throw new Error(`No user found with id ${userId}`);

  return ThirdParty.delete(thirdPartyId)
    .then((deleted) => {
      if (!deleted) throw new Error(`Error deleting thirdparty id ${thirdPartyId}`);
      const index = user.thirdParties.indexOf(thirdPartyId);
      user.thirdParties.splice(index, 1);
      user.save((err, result) => {
        if (err) throw new Error(err.message);
        return result.public();
      });
    });
});

module.exports.authSpotifyCb = (userId, code, state, authParam) => {
  let authOptions = {
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: config.external.spotify.redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': `Basic ${authParam}` 
    }
  };

  return rp(authOptions)
    .then((response) => {
      try {
        response = JSON.parse(response);
      } catch(e) {
        console.log('errored while parsing response', e);
        response = response;
      }

      let thirdPartyOpts = {
        source: 'spotify',
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
        userId
      };

      return exports.createThirdParty(thirdPartyOpts);
    });
};

module.exports.evalSpotify = function evalSpotify(userId, spotifyAccessToken, spotifyRefreshToken, spotifyId, correlationId) {
  let spotifyOpts, reqOpts,
    domainsIndex;
  let domains = {
    artists: {
      uri:'https://api.spotify.com/v1/me/top/artists?limit=50',
      fields: [
        'name',
        'images',
        'popularity',
        'externalId',
        'externalUri',
        'genres'
      ],
      creator: (dataObj, userId) => {
        const genres = dataObj.genres;
        delete dataObj.genres;
        // TODO: fix artists names to save as camel
        // createOrUpdate to add factor as creates instead
        return Artist.create(dataObj)
          .then(res => promise.mapSeries(genres, (each, i) => {
            let genreKey = /-|\s/.test(each) ? upperCaser(each) : each,
              genre,
              genreIndex,
              artistIndex;
            genre = {
              name: genreKey,
              userId: res.userId,
              artistId: res._id
            }

            // take this out eventually
            return Genre.create(genre)
              .catch(err => console.log('error creating genre', err.message));
          }))
          .catch(err => console.log('error creating artist', err.message))
      }
    },
    tracks: {
      uri: 'https://api.spotify.com/v1/me/top/tracks?limit=50',
      fields: [
        'name',
        'popularity',
        'externalId',
        'externalUri'
      ],
      creator: (data) => Track.create(data)
        .then(res => res._id)
        .catch(err => console.log('error creating track', err.message))
    }
  };

  domainsIndex = Object.keys(domains);
  reqOpts = [];
  domainsIndex.forEach(each => {
    reqOpts.push({
      method: 'GET',
      uri: domains[each].uri,
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`
      },
      json: true
    });
  });

  return ThirdParty.getByUserId(userId)
    .then((thirdParty) => {
      if (moment(thirdParty.lastEval).isBefore(moment().utc()), 'day') {
        let newError = new Error(`No update, please retry after ${moment(thirdParty.lastEval).add(1, 'days').format()}`);
        newError.statusCode = 429;
        throw newError;
      } else {
        return spotifyResolver(reqOpts, spotifyId, spotifyAccessToken, spotifyRefreshToken, correlationId)
          .then(data => {
            return promise.mapSeries(data, (dataObj, i) => {
              let currFields = domains[domainsIndex[i]].fields;
              return promise.mapSeries(dataObj.items, (item, j) => {
                let newObj = {};
                let x = 0;
                while(x < currFields.length) {
                  newObj[currFields[x]] = item[currFields[x].replace(/external/, '').toLowerCase()];
                  x++;
                }

                newObj.userId = userId;
                return domains[domainsIndex[i]].creator(newObj);
              });
            });
          })
          .then((result) => {
            return exports.updateThirdParty(spotifyId, { lastEval: moment().utc().format() }, correlationId) 
              .then(() => User.withProfile(userId, 'all'));
          });    
      }
    });
};
