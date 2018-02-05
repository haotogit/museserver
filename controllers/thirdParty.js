const user = require('../processors/users');
const thirdPartyProcessor = require('../processors/thirdParty');

module.exports.createThirdParty = (req, res) => {
  const newThirdParty = req.body;
  newThirdParty.userId = req.params.id;

  thirdPartyProcessor.createThirdParty(newThirdParty)
    .then((data) => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    })
};

module.exports.updateThirdParty = (req, res) => {
  const updateInfo = req.body;
  const { thirdPartyId } = req.params;

  thirdPartyProcessor.updateThirdParty(thirdPartyId, updateInfo)
    .then((result) => {
      res.json(result);
    })
    .catch(err => res.json(err));
};

module.exports.deleteThirdParty = (req, res) => {
  const { id, thirdPartyId } = req.params;

  thirdPartyProcessor.deleteThirdParty(id, thirdPartyId)
    .then(() => res.json({ thirdPartyId }))
    .catch(err => res.json(err));
};

