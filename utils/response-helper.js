const logger = require('./logger');

module.exports = (res, result, correlationId) => {
  logger.info({ message: 'RESPONSE', correlationId });
  res.json(result);
};
