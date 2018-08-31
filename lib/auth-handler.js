const moment = require('moment');
const tokenCheck = require('./token-check');
const logger = require('./logger');

module.exports = (req, res, next) => {
  const token = req.headers && req.headers.authorization ? req.headers.authorization.split(' ') : null;
  const noTokenErr = new Error('Invalid request missing token');
  noTokenErr.statusCode = 401;
  if (!token) return next(noTokenErr);

  const notBearer = new Error(`Invalid token type ${token[0]}`);
  notBearer.statusCode = 400;
  if (token[0] !== 'Bearer') return next(notBearer);

  //when checking exp, do result.exp * 1000
  tokenCheck(token[1])
    .then(result => next())
    .catch(next);
};
