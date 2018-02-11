const User = require('../models/user');
const ThirdParty = require('../models/thirdParty');

module.exports.createUser = (newUser) => User.createUser(newUser);

module.exports.authUser = (creds) => User.authUser(creds)
//.then((user) => {
//  return ThirdParty.getByUserId(user._id)
//    .then((data) => {
//      user.thirdParty = data;
//
//      return user;
//    });
// });

module.exports.updateUser = (id, updateInfo) => User.update(id, updateInfo);
