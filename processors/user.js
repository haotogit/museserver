const User = require('../models/user');
const ThirdParty = require('../models/third-party');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { 
	makeErr,
} = require('../utils');

module.exports.createUser = (newUser) => exports.checkUsername(newUser.username)
	.then(exists => {
		if (exists) throw makeErr(`Username exists, choose another`, 400);
		return User.createUser(newUser);
	});

module.exports.authUser = (creds) => User.authUser(creds);

module.exports.updateUser = (id, updateInfo) => User.update(id, updateInfo);

module.exports.getProfile = (id, accessList) => User.withProfile(id, accessList)
	.then(user => user.public());

module.exports.checkUsername = (username) => User.getByUsername(username);
