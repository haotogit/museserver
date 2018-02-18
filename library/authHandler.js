const tokenCheck = require('./tokenCheck');

module.exports = (req, res, next) => {
  next();
  //let token = req.headers && req.headers.authorization ? req.headers.authorization : null;

  //tokenCheck(token)
  //  .then(result => next())
  //  .catch(err => res.status(err.statusCode || 401).send(err.message || 'Error with token validation'));
};
