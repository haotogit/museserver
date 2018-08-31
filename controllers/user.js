const userProcessor = require('../processors/user');
const errorResponder = require('../utilities/errorResponseHelper');
const responder = require('../utilities/responseHelper');

module.exports.authUser = (req, res) => {
  const { body, correlationId } = req;
  userProcessor.authUser(body)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => errorResponder(err, res, correlationId));
};

module.exports.createUser = (req, res) => {
  const { body, correlationId } = req;
  userProcessor.createUser(body)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => errorResponder(err, res, correlationId));
};

module.exports.updateUser = (req, res) => {
  const id = req.params.id;
  const { body, correlationId } = req;
  userProcessor.updateUser(id, body)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => errorResponder(err, res, correlationId));
};

module.exports.getProfile = (req, res) => {
  const { id } = req.params;
  const { accessList } = req.query;
  const { correlationId } = req;
  userProcessor.getProfile(id, accessList)
    .then((resp) => responder(res, resp, correlationId))
    .catch((err) => errorResponder(err, res, correlationId));
}
