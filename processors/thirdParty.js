const promise = require('bluebird');
const ThirdParty = require('../models/thirdParty'),
  User = require('../models/user'),
  Artist = require('../models/artist'),
  config = require('../config/config'),
  spotifyResolver = require('../library/spotifyResolver');

const rp = require('request-promise');

module.exports.createThirdParty = (options) => ThirdParty.create(options)
  .then((thirdParty) => {
    return User.getById(thirdParty.userId).then(user => {
      user.thirdParties.push(thirdParty._id);
      user.save((err, result) => {
        if (err) throw new Error(err.message);
        return result.public();
      });
    });
  });

module.exports.updateThirdParty = (thirdPartyId, updateInfo) => {
  const updateObj = updateInfo;
  let currArtists = updateInfo.artists ? updateInfo.artists : [];

  if (currArtists.length !== 0) {
    return promise.map(currArtists, (artist) => {
      return Artist.create(artist);
    }, { concurrency: 1 })
    .then((results) => {
      updateObj.artists = results.map((artist) => artist._id);

      return ThirdParty.update(thirdPartyId, updateObj)
        .then((res) => {
          console.log("updated", res);
        })
    });
  }
  
  return ThirdParty.update(thirdPartyId, updateInfo);
};

module.exports.deleteThirdParty = (userId, thirdPartyId) => User.getById(userId).then(user => {
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
      const { access_token, refresh_token, expires_in } = JSON.parse(response);
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

function keyMaker (str) {
  return str.split(/\-|\s/).length === 1 ? str : str.split(/\-|\s/).map((each, i) => i === 0 ? each : each.replace(each[0], (match) => match.toUpperCase())).join('')
}

function sortArr (a, b) {
  if (a.value > b.value) {
    return -1
  }

  if (a.value < b.value) {
    return 1
  }

  return 0
}

module.exports.evalSpotify = (id, spotifyObj) => {
  return User.getById(id)
    .then(user => {
      let uris = [
        'https://api.spotify.com/v1/me/top/tracks?limit=50',
        'https://api.spotify.com/v1/me/top/artists?limit=50'
      ];
      let spotifyOpts = {
        method: 'GET',
        uri: '',
        headers: {
          Authorization: `Bearer ${spotifyObj.accessToken}`
        },
        json: true
      };

      let reqOpts = [];
      for(let i = 0; i < uris.length; i++) {
        spotifyOpts.uri = uris[i];
        reqOpts.push(spotifyOpts);
      }

      return spotifyResolver(spotifyObj, reqOpts)
        .then(data => {
          let top10;
          let thirdPartyObj = {};
          let dataObj = data[0].items;
          let genres = [];

          thirdPartyObj.artists = dataObj.map(artist => {
            let currArtist = {};
            artist.genres.forEach((each, i) => {
              let genreKey = keyMaker(each),
                genre,
                genreIndex,
                artistIndex

              if (!genres.find((ea) => ea.label === genreKey)) {
                genres.push(genreKey);
                //genreIndex = genres.findIndex((ea) => ea.label === genreKey)
                //genres[genreIndex].value++
              }
            });

            currArtist = {
              name: artist.name,
              genres: artist.genres ? artist.genres : [],
              image: artist.images,
              popularity: artist.popularity,
              externalId: artist.id,
              externalUri: artist.uri
            };
            return currArtist;
          });

          thirdPartyObj.genres = genres.sort(sortArr);
          thirdPartyObj.top10 = genres.slice(0, 10)

          return exports.updateThirdParty(spotifyObj._id, thirdPartyObj);
        });
    });
};
