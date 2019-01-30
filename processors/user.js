const User = require('../models/user');
const ThirdParty = require('../models/third-party');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports.createUser = (newUser) => User.createUser(newUser);

module.exports.authUser = (creds) => User.authUser(creds)
  .then(user => User.withProfile(user._id, 'thirdParties:'));

module.exports.updateUser = (id, updateInfo) => User.update(id, updateInfo);

module.exports.getProfile = (id, accessList) => User.withProfile(id, accessList);
