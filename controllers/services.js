const thirdPartyProcessor = require('../processors/thirdParty');

module.exports.healthCheck = (req, res, next) => {
  const system = {
    uptime: process.uptime(),
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage()
  };

  res.json(system);
};

module.exports.createThirdParty = (req, res) => {
  const newThirdParty = req.body.thirdParty; 
  newThirdParty.userId = req.params.id;

  thirdPartyProcessor.createThirdParty(newThirdParty)
    .then((data) => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    })
};
