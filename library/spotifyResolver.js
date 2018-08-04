const rp = require('request-promise');
const promise = require('bluebird');
const urlLib = require('url');
const config = require('../config/config');

module.exports = (spotifyObj, spotifyOpts) => {
  let refresherOpts, nextItem, authParam, dataObj;
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
  ];

  return promise.mapSeries(spotifyOpts, (val) => rp(val))
    .catch(err => {
      let error = err.error;
      if (error.error.message === 'The access token expired') {
        spotifyOpts.unshift(refresherOpts);
        return null;
      }
      throw new Error(error.error.message);
    })
    .then((res) => {
      if (res) return res;
      return promise.mapSeries(spotifyOpts, (value, i) => {
        return rp(value)
          .then((data) => {
            if (i === 0) {
              try {
                dataObj = JSON.parse(data);
              } catch(e) {
                dataObj = data;
              } 
              do {
                spotifyOpts[++i].headers.Authorization = `Bearer ${dataObj.access_token}`;
              } while(i < spotifyOpts.length);
              //nextItem = refresherOpts[++i];
              //nextItem.headers.Authorization = `Bearer ${data.access_token}`;
            }
            return data;
          })
          // this is to allow requesting all items, independent of individual responses
        //.catch(err => new Error(err.message || err));
      })
      .catch(err => {
        throw new Error(err.message);
      });
    });
};
