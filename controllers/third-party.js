const urlLib = require('url');
const qString = require('query-string');

const user = require('../processors/user');
const thirdPartyProcessor = require('../processors/third-party');
const config = require('../config/config');
const responder = require('../utilities/response-helper');

module.exports.createThirdParty = (req, res, next) => {
  const newThirdParty = req.body;
  const { correlationId } = req;
  newThirdParty.userId = req.params.id;
  thirdPartyProcessor.createThirdParty(newThirdParty)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};

module.exports.updateThirdParty = (req, res, next) => {
  const updateInfo = req.body;
  const { correlationId } = req;
  const { thirdPartyId } = req.params;

  thirdPartyProcessor.updateThirdParty(thirdPartyId, updateInfo)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};

module.exports.deleteThirdParty = (req, res, next) => {
  const { id, thirdPartyId } = req.params;
  const { correlationId } = req;

  thirdPartyProcessor.deleteThirdParty(id, thirdPartyId)
    .then((resp) => responder(res, { thirdPartyId }, correlationId))
    .catch(next);
};

module.exports.authSpotifyCb = (req, res, next) => {
  const { code, state } = req.query;
  const userId = state.split('=')[1];

  thirdPartyProcessor.authSpotifyCb(userId, code, state)
    .then(result => res.redirect(urlLib.format(config.app.client)))
    .catch(next);
};

module.exports.evalSpotify = (req, res, next) => {
  const { id } = req.params;
  const { spotifyAccessToken, spotifyId, spotifyRefreshToken } = req.query;
  const { correlationId } = req;

  thirdPartyProcessor.evalSpotify(id, spotifyAccessToken, spotifyRefreshToken, spotifyId, correlationId)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};
