const promise = require('bluebird');
const ThirdParty = require('../models/third-party'),
  User = require('../models/user'),
  Artist = require('../models/artist'),
  Genre = require('../models/genre'),
  Track = require('../models/track'),
  config = require('../config/config'),
  spotifyResolver = require('../library/spotifyResolver'),
  helpers = require('../library/tools');

const rp = require('request-promise');

module.exports.createThirdParty = (options) => ThirdParty.create(options)
  .then((thirdParty) => {
    return User.withProfile(thirdParty.userId, 'thirdParties:').then(user => {
      user.thirdParties.push(thirdParty._id);
      user.save((err, result) => {
        if (err) throw new Error(err.message);
        return result.public();
      });
    });
  });

module.exports.updateThirdParty = (thirdPartyId, updateInfo) => ThirdParty.update(thirdPartyId, updateInfo);

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
        const { access_token, refresh_token, expires_in } = JSON.parse(response);
      } catch(e) {
        throw new Error(e.message || 'Error authenticating spotify');
      }

      let thirdPartyOpts = {
        source: 'spotify',
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        userId
      };

      return exports.createThirdParty(thirdPartyOpts);
    });
};

module.exports.evalSpotify = (id) => {
  let spotifyObj, spotifyOpts, reqOpts,
    domainsIndex;
  let domains = {
    artists: {
      uri:'https://api.spotify.com/v1/me/top/artists?limit=50',
      fields: [
        'name',
        'images',
        'popularity',
        'externalId',
        'externalUri'
      ]
    },
    tracks: {
      uri: 'https://api.spotify.com/v1/me/top/tracks?limit=50',
      fields: [
        'name',
        'popularity',
        'externalId',
        'externalUri'
      ]
    }
  };

  let parsers = {
    artists: (data, userId) => {
      let top10;
      let dataObj = data.items;
      let genres = [];
      return promise.mapSeries(dataObj, (artist) => {
        let currArtist = {};
        currArtist = {
            name: artist.name,
            images: artist.images,
            popularity: artist.popularity,
            externalId: artist.id,
            externalUri: artist.uri,
            userId: userId
          };

          return Artist.create(currArtist)
            .then(res => {
              return promise.mapSeries(artist.genres, (each, i) => {
                let genreKey = /-|\s/.test(each) ? tools.keyToUpperCase(each) : each,
                  genre,
                  genreIndex,
                  artistIndex

                genre = {
                  name: genreKey,
                  userId: userId,
                  artistId: res._id
                }

                return Genre.create(genre)
                  .catch(err => console.log('error creating genre', err.message));
              });
            })
            .catch(err => console.log('error creating artist', err.message));
      });
      //thirdPartyObj.genres = genres;
      // needs to be moved as virtual;
      //thirdPartyObj.top10 = genres.slice(0, 10)
    },
    tracks: (data, userId) => {
      let respObj = {};
      return promise.mapSeries(data.items, (item, i) => {
        let j = 0;
        let currFields = domains.tracks.fields;
        while(j < currFields.length - 1) {
          let normalKey = currFields[j].replace(/external/, '');
          respObj[currFields[j]] = item[/external/.test(currFields[j]) ? normalKey : currFields[j]];
          j++;
        }

        respObj.userId = userId;
        return Track.create(respObj)
          .then(res => res._id)
          .catch(err => console.log('error creating track', err.message));
      });
    }
  };

  return User.withProfile(id, 'thirdParties:artists:genres:tracks:')
    .then(user => {
      spotifyObj = user.thirdParties[0];
      reqOpts = [];
      Object.keys(domains).forEach(each => {
        reqOpts.push({
          method: 'GET',
          uri: domains[each].uri,
          headers: {
            Authorization: `Bearer ${spotifyObj.accessToken}`
          },
          json: true
        });
      });

      domainsIndex = Object.keys(domains);
      return spotifyResolver(spotifyObj, reqOpts)
        .then(data => {
          let userObj = {};
          return promise.mapSeries(data, (dataObj, i) => {
            return parsers[domainsIndex[i]](dataObj, user._id)
              .catch(err => new Error(err.message));
          });
        });
    });
};
