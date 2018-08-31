const userProcessor = require('../processors/user');
const errorResponder = require('../utilities/errorResponseHelper');

module.exports.authUser = (req, res) => {
  const { body } = req;

  userProcessor.authUser(body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => errorResponder(err, res));
};

module.exports.createUser = (req, res) => {
  const { body } = req;

  userProcessor.createUser(body)
    .then((obj) => {
      res.json(obj)
    })
    .catch((err) => {
      console.log('err', err);
      res.json(err);
    });
};

module.exports.updateUser = (req, res) => {
  const id = req.params.id,
    body = req.body;

  userProcessor.updateUser(id, body)
    .then((resp) => {
      res.json(resp);
    })
    .catch(err => {
      res.status(err.statusCode || 500).send({ error: err.message });
    });
};

module.exports.tokenCheck = (req, res) => {
  let token = req.headers && req.headers.authorization ? req.headers.authorization : null;

  if (token) {
    userProcessor.tokenCheck(token)
      .then((user) => {
        res.json(user);
      })
      .catch(err => {
        res.status(err.statusCode || 500).send({ error: err.message });
      })
  }
};

module.exports.getProfile = (req, res) => {
  const { id } = req.params;
  const { accessList } = req.query;

  userProcessor.getProfile(id, accessList)
    .then(resp => res.json(resp))
    .catch(err => {
      res.status(err.statusCode || 500).send({ error: err.message });
    });
}
