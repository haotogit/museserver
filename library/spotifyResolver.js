const rp = require('request-promise');
const promise = require('bluebird');
const urlLib = require('url');
const config = require('../config/config');

module.exports = (spotifyObj, spotifyOpts) => {
  let refresherOpts, nextItem, authParam;
  authParam = new Buffer(`${config.external.spotify.clientId}:${config.external.spotify.clientSecret}`).toString('base64');
  refresherOpts = [
    {
      method: 'POST',
      uri: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: `Basic ${authParam}`
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: spotifyObj.refreshToken
      }
    },
    spotifyOpts
  ];

  return rp(spotifyOpts)
    .catch(err => {
      let error = JSON.parse(err.error);
      if (error.error.message === 'The access token expired') return refresherOpts;
      throw new Error(error.error.message);
    })
    .then((res) => {
      return promise.mapSeries(refresherOpts, (value, i) => {
        return rp(value)
          .then((data) => {
            let parsedData = JSON.parse(data);
            if (i === 0) {
              nextItem = refresherOpts[++i];
              nextItem.headers.Authorization = `Bearer ${parsedData.access_token}`;
            }
            return parsedData;
          });
      })
      .then((result) => {
        // only return original request's response
        return result[1];
      })
      .catch(err => {
        throw new Error(err.message);
      });
    })
    
};
