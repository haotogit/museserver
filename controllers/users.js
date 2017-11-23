const userProcessor = require('../processors/user');

//module.exports.createUser = (req, res, next) => {
//  const options = requestOptions(req);
//  userProcessor.createUser
//
//};

module.exports.authUser = (req, res) => {
  
  res.end();
};

module.exports.createUser = (req, res) => {
  console.log(req)
  res.end();
};
