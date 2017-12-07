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
  const { body, id } = req;

  //userProcessor.updateUser(id, body)
};
