const userProcessor = require('../processors/user');
const { responder } = require('../utils');

module.exports.authUser = (req, res, next) => {
  const { body, correlationId } = req;
	userProcessor.authUser(body)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { body, correlationId } = req;
  userProcessor.createUser(body)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const { body, correlationId } = req;
  userProcessor.updateUser(id, body)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  const { id } = req.params;
  const { accessList } = req.query;
  const { correlationId } = req;
  userProcessor.getProfile(id, accessList)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
}
