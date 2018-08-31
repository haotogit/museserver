const User = require('../models/user');
const ThirdParty = require('../models/third-party');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const tokenCheck = require('../lib/tokenCheck');

module.exports.createUser = (newUser) => User.createUser(newUser);

module.exports.authUser = (creds) => User.authUser(creds)

module.exports.updateUser = (id, updateInfo) => User.update(id, updateInfo);

module.exports.tokenCheck = (token) => tokenCheck(token)
  .then(data => User.getById(data._id));

module.exports.getProfile = (id, accessList) => User.withProfile(id, accessList);
