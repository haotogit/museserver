const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (newUser) => {
  let obj = {};
  let fields = ['_id'];
  fields.forEach(field => obj[field] = newUser[field]);
	return new Promise((resolve) => {
		jwt.sign(obj, config.app.tokenSecret, { expiresIn: '1h' }, (err, token) => {
			if (err) throw makeErr(`Error authenticating with ${JSON.stringify(creds)}`);
			resolve(token);
		});
	});
};
