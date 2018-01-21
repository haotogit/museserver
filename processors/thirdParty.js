const ThirdParty = require('../models/thirdParty'),
  User = require('../models/user');

module.exports.createThirdParty = (options) => ThirdParty.create(options)
  .then((thirdParty) => {
    return User.getById(thirdParty.userId).then(user => {
      user.thirdParties.push(thirdParty._id);
      return user.save();
    });
  });
