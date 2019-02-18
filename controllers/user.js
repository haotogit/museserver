const userProcessor = require('../processors/user');
const responder = require('../utilities/response-helper');

module.exports.authUser = (req, res, next) => {
  const { body, correlationId } = req;
  userProcessor.authUser(body)
    .then((resp) => {
      responder(res, resp, correlationId);
      const used = process.memoryUsage();
      for (key in used) {
        used[key] = Math.round(used[key] / 1024 / 1024 * 100) / 100;
      }
      console.log('memory used', used);
    })
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
