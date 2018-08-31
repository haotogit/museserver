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
    .catch((err) => next(err));
};

module.exports.updateThirdParty = (req, res, next) => {
  const updateInfo = req.body;
  const { correlationId } = req;
  const { thirdPartyId } = req.params;

  thirdPartyProcessor.updateThirdParty(thirdPartyId, updateInfo)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => next(err));
};

module.exports.deleteThirdParty = (req, res, next) => {
  const { id, thirdPartyId } = req.params;
  const { correlationId } = req;

  thirdPartyProcessor.deleteThirdParty(id, thirdPartyId)
    .then((resp) => responder(res, { thirdPartyId }, correlationId))
    .catch((err) => next(err));
};

module.exports.authSpotifyCb = (req, res, next) => {
  const { code, state } = req.query;
  const authParam = new Buffer(`${config.external.spotify.clientId}:${config.external.spotify.clientSecret}`).toString('base64');
  const userId = state.split('=')[1];

  thirdPartyProcessor.authSpotifyCb(userId, code, state, authParam)
    .then(result => res.redirect(urlLib.format(config.app.client)))
    .catch(err => next(err));
};

module.exports.evalSpotify = (req, res, next) => {
  const { id } = req.params;
  const { correlationId } = req;

  thirdPartyProcessor.evalSpotify(id)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => next(err));
};
