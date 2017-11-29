const userProcessor = require('../processors/users');

module.exports.authUser = (req, res) => {
  const { body } = req;

  userProcessor.authUser(body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      console.log('err', err);
      res.json(err);
    })
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
