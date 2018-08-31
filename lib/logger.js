const uuid = require('uuid/v4');
const logger = require('../utilities/logger');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const correlationId = uuid();
  const loggerObj = {
    path: req.url,
    method: req.method,
    correlationId
  };

  if (req.body) loggerObj.body = req.body;
  logger.info(loggerObj);
  req.correlationId = correlationId;
  next();
};
