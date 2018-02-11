const userProcessor = require('../processors/users');

module.exports.authUser = (req, res) => {
  const { body } = req;

  userProcessor.authUser(body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      res.json({ error: { message: err.message } });
    });
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
