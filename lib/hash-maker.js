const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

module.exports.hashMaker = function hashMaker(dataToHash) {
	let sha256 = crypto.createHash('sha256')
		.update(dataToHash)
		.digest();
	return base64URLEncode(sha256);
};

module.exports.cryptoStrMaker = function cryptoStrMaker() {
	return base64URLEncode(crypto.randomBytes(77));
};
