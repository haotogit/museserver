const rp = require('request-promise');
const promise = require('bluebird');
const urlLib = require('url');
const config = require('../config/config');

const tpProcessor = require('../processors/third-party');

module.exports = function SpotifyResolver(spotifyOpts, spotifyId, spotifyAccessToken, spotifyRefreshToken, correlationId) {
  let refresherOpts, nextItem, authParam, dataObj,
    updateObj, error;
  authParam = new Buffer(`${config.external.spotify.clientId}:${config.external.spotify.clientSecret}`).toString('base64');
  refresherOpts = {
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${authParam}`
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: spotifyRefreshToken
    }
  };

  return promise.mapSeries(spotifyOpts, (val) => rp(val))
    .catch(err => {
      error = err.error;
      if (error.error.message === 'The access token expired') {
        return rp(refresherOpts)
          .then((res) => {
            try {
              dataObj = JSON.parse(res);
            } catch(e) {
              dataObj = res;
            }

            for (let i = 0; i < spotifyOpts.length; i++) {
              spotifyOpts[i].headers.Authorization = `Bearer ${dataObj.access_token}`;
            }

            updateObj = {
              accessToken: dataObj.access_token
            };

            // something is setting refreshtoken to null.. is it after a refresh it returns null for refreshToken ?
            if (dataObj.refresh_token) updateObj.refreshToken = dataObj.refresh_token;

            return tpProcessor.updateThirdParty(spotifyId, updateObj, correlationId)
              .then((res) => SpotifyResolver(spotifyOpts, spotifyId, spotifyAccessToken, spotifyRefreshToken, correlationId));
          });
      }

      throw new Error(error.error.message);
    })
    .catch(err => {
      throw new Error(err.message);
    });
};
