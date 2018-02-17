const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, config.app.tokenSecret, (err, result) => {
    if (err) reject(err);

    resolve(result);
  });
})
