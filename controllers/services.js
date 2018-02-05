const thirdPartyProcessor = require('../processors/thirdParty');

module.exports.healthCheck = (req, res, next) => {
  const system = {
    uptime: process.uptime(),
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage()
  };

  res.json(system);
};
