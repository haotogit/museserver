const user = require('../processors/users');
const thirdPartyProcessor = require('../processors/thirdParty');
const config = require('../config/config');
const urlLib = require('url');
const qString = require('query-string');

module.exports.createThirdParty = (req, res) => {
  const newThirdParty = req.body;
  newThirdParty.userId = req.params.id;

  thirdPartyProcessor.createThirdParty(newThirdParty)
    .then((data) => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    })
};

module.exports.updateThirdParty = (req, res) => {
  const updateInfo = req.body;
  const { thirdPartyId } = req.params;

  thirdPartyProcessor.updateThirdParty(thirdPartyId, updateInfo)
    .then((result) => {
      res.json(result);
    })
    .catch(err => res.json(err));
};

module.exports.deleteThirdParty = (req, res) => {
  const { id, thirdPartyId } = req.params;

  thirdPartyProcessor.deleteThirdParty(id, thirdPartyId)
    .then(() => res.json({ thirdPartyId }))
    .catch(err => res.json(err));
};

module.exports.authSpotifyCb = (req, res) => {
  const { code, state } = req.query;
  const authParam = new Buffer(`${config.external.spotify.clientId}:${config.external.spotify.clientSecret}`).toString('base64');
  const userId = state.split('=')[1];

  thirdPartyProcessor.authSpotifyCb(userId, code, state, authParam)
    .then(result => res.redirect(urlLib.format(config.app.client)))
    .catch(err => res.status(err.statusCode || 500).send(err.message));
};

module.exports.evalSpotify = (req, res) => {
  const { id } = req.params;
  thirdPartyProcessor.evalSpotify(id)
    .then(result => res.json(result))
    .catch(err => {
      console.log('WHATHEFUCK===', err)
      res.status(err.statusCode || 500).send(err.message);
    });
};
