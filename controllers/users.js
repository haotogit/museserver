const userProcessor = require('../processors/users');

//module.exports.createUser = (req, res, next) => {
//  const options = requestOptions(req);
//  userProcessor.createUser
//
//};

module.exports.authUser = (req, res) => {
  
  res.end();
};

module.exports.createUser = (req, res) => {
  const { body } = req;

  userProcessor.createUser(body)
    .then((obj) => {
      res.json(obj)
    });
};
