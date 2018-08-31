const moment = require('moment');
const tokenCheck = require('./token-check');
const logger = require('./logger');

module.exports = (req, res, next) => {
  const token = req.headers && req.headers.authorization ? req.headers.authorization.split(' ') : null;
  if (token) {
    if (token[0] !== 'Bearer') res.status(400).send({ error: 'Invalid token type', type: token[0] });
    else if (!token[1]) res.status(400).send({ error: 'Invalid request missing token' });
  }

  //when checking exp, do result.exp * 1000
  tokenCheck(token[1])
    .then(result => next())
    .catch(err => next(err));
};
