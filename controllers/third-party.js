const urlLib = require('url');
const qString = require('query-string');
const rp = require('request-promise');

const user = require('../processors/user');
const thirdPartyProcessor = require('../processors/third-party');
const config = require('../config/config');
const { responder, logger } = require('../utils');
const { 
	hashMaker,
	cryptoStrMaker,
	spotifyResolver,
} = require('../lib');

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
  let { code, state } = req.query;
	state = state.split(':');

  thirdPartyProcessor.authSpotifyCb(state[0], code, state[1])
    .then(result => res.redirect(urlLib.format(config.app.client)))
    .catch(next);
};

module.exports.evalSpotify = (req, res, next) => {
  const { id } = req.params;
  const { correlationId } = req;

	// for some reason spotifReolver is undefined when requiring
	// at processor so passing it down
  thirdPartyProcessor.evalSpotify(id, spotifyResolver, correlationId)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};

module.exports.linkSpotify = (req, res, next) => {
  const scope = 'user-read-private user-top-read user-library-read user-read-email user-read-birthdate';
	const verifier = cryptoStrMaker();
	const codified = hashMaker(verifier);
  const url = `https://accounts.spotify.com/authorize?${qString.stringify({
    client_id: config.external.spotify.clientId,
    response_type: 'code',
    redirect_uri: config.external.spotify.redirectUri,
		code_challenge_method: 'S256',
		code_challenge: codified,
		// TODO hash this
    state: `${req.query.ctx}:${verifier}`,
    scope: scope,
  })}`;

	res.redirect(url);
};
