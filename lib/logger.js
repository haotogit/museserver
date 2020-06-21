const uuid = require('uuid/v4');
const { logger } = require('../utils');

module.exports = (req, res, next) => {
  const correlationId = uuid();
  const loggerObj = {
    message: 'INCOMING_REQUEST',
    path: req.url,
    method: req.method,
    origin: req.headers.origin || 'none',
    correlationId
  };

  if (req.body) loggerObj.body = req.body;
  logger.info(loggerObj);
  req.correlationId = correlationId;
  next();
};
