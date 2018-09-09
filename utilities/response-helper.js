const logger = require('./logger');

module.exports = (res, result, correlationId) => {
  logger.debug({ message: 'RESPONSE', correlationId, result: JSON.stringify(result) });
  res.json(result);
};
