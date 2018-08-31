const urlLib = require('url');
const qString = require('query-string');

const user = require('../processors/user');
const thirdPartyProcessor = require('../processors/third-party');
const config = require('../config/config');
const errorResponder = require('../utilities/errorResponseHelper');
const responder = require('../utilities/responseHelper');

module.exports.createThirdParty = (req, res) => {
  const newThirdParty = req.body;
  const { correlationId } = req;
  newThirdParty.userId = req.params.id;
  thirdPartyProcessor.createThirdParty(newThirdParty)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => errorResponder(err, res, correlationId));
};

module.exports.updateThirdParty = (req, res) => {
  const updateInfo = req.body;
  const { correlationId } = req;
  const { thirdPartyId } = req.params;

  thirdPartyProcessor.updateThirdParty(thirdPartyId, updateInfo)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => errorResponder(err, res, correlationId));
};

module.exports.deleteThirdParty = (req, res) => {
  const { id, thirdPartyId } = req.params;
  const { correlationId } = req;

  thirdPartyProcessor.deleteThirdParty(id, thirdPartyId)
    .then((resp) => responder(res, { thirdPartyId }, correlationId))
    .catch((err) => errorResponder(err, res, correlationId));
};

module.exports.authSpotifyCb = (req, res) => {
  const { code, state } = req.query;
  const authParam = new Buffer(`${config.external.spotify.clientId}:${config.external.spotify.clientSecret}`).toString('base64');
  const userId = state.split('=')[1];

  thirdPartyProcessor.authSpotifyCb(userId, code, state, authParam)
    .then(result => res.redirect(urlLib.format(config.app.client)))
    .catch(err => {
      console.log('whatthefukkk', err)
      res.status(err.statusCode || 500).send(err.message)
    });
};

module.exports.evalSpotify = (req, res) => {
  const { id } = req.params;
  const { correlationId } = req;
  thirdPartyProcessor.evalSpotify(id)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => errorResponder(err, res, correlationId));
};
