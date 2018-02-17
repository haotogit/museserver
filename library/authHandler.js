const tokenCheck = require('./tokenCheck');

module.exports = (req, res, next) => {
  let whiteList = /healthcheck|(users\/auth)|authSpotify/;

  if (whiteList.test(req.url) || (/users/.test(req.url) && req.method === 'POST')) return next();

  let token = req.headers && req.headers.authorization ? req.headers.authorization : null;

  tokenCheck(token)
    .then(result => next())
    .catch(err => res.status(err.statusCode || 401).send(err.message || 'Error with token validation'));
};
