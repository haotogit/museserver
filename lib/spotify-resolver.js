const rp = require('request-promise');
const promise = require('bluebird');
const urlLib = require('url');
const config = require('../config/config');
const tpProcessor = require('../processors/third-party');

module.exports = function spotifyResolver(spotifyOpts, spotifyId, spotifyAccessToken, spotifyRefreshToken, correlationId) {
  let refresherOpts, nextItem, dataObj,
    updateObj, error;
  refresherOpts = {
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
			refresh_token: spotifyRefreshToken,
			client_id: config.external.spotify.clientId
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
              .then((resp) => spotifyResolver(spotifyOpts, spotifyId, resp.accessToken, resp.refreshToken, correlationId));
          });
      }

      throw new Error(`Refreshing spotify token ${error.error.message}`);
    })
    .catch(err => {
      throw new Error(`Error getting spotify data ${err.message}`);
    });
};
