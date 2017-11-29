const User = require('../models/user');

module.exports.createUser = (newUser) => User.createUser(newUser);

module.exports.authUser = (creds) => User.authUser(creds);
