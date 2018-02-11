const promise = require('bluebird');
const ThirdParty = require('../models/thirdParty'),
  User = require('../models/user'),
  Artist = require('../models/artist');

module.exports.createThirdParty = (options) => ThirdParty.create(options)
  .then((thirdParty) => {
    return User.getById(thirdParty.userId).then(user => {
      user.thirdParties.push(thirdParty._id);
      user.save();
      return user.public();
    });
  });

module.exports.updateThirdParty = (thirdPartyId, updateInfo) => {
  const updateObj = updateInfo;
  let currArtists = updateInfo.artists ? updateInfo.artists : [];

  if (currArtists.length !== 0) {
    return promise.map(currArtists, (artist) => {
      return Artist.create(artist);
    }, { concurrency: 1 })
    .then((results) => {
      updateObj.artists = results.map((artist) => artist._id);

      return ThirdParty.update(thirdPartyId, updateObj);
    });
  }
  
  return ThirdParty.update(thirdPartyId, updateInfo);
};

module.exports.deleteThirdParty = (userId, thirdPartyId) => User.getById(userId).then(user => {
  if (!user) throw new Error(`No user found with id ${userId}`);

  return ThirdParty.delete(thirdPartyId)
    .then((deleted) => {
      if (!deleted) throw new Error(`Error deleting thirdparty id ${thirdPartyId}`);
      const index = user.thirdParties.indexOf(thirdPartyId);
      const u = user.thirdParties.splice(index, 1);
      return user.save();
    });
});
