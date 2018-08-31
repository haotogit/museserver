const userProcessor = require('../processors/user');
const responder = require('../utilities/response-helper');

module.exports.authUser = (req, res, next) => {
  const { body, correlationId } = req;
  userProcessor.authUser(body)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { body, correlationId } = req;
  userProcessor.createUser(body)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const { body, correlationId } = req;
  userProcessor.updateUser(id, body)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => next(err));
};

module.exports.getProfile = (req, res, next) => {
  const { id } = req.params;
  const { accessList } = req.query;
  const { correlationId } = req;
  userProcessor.getProfile(id, accessList)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => next(err));
}
