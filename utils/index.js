const logger = require('./logger'),
	makeToken = require('./make-token'),
	responder = require('./response-helper'),
	promiser = require('./query-promiser');

const upperCaser = (str) => str[0].toLowerCase()+str.replace(/(-|\s)[a-z]/ig, (m) => m[1].toUpperCase()).substring(1);

const makeErr = (msg, code) => {
	const newErr = new Error(msg);
	newErr.statusCode = code;
	return newErr;
};

module.exports = {
	logger,
	makeToken,
	responder,
	upperCaser,
	makeErr,
	promiser,
};
