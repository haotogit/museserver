const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) {
	logger.info(`faaaaaaaaaaaaa ${JSON.stringify(err)}`);
  logger.error({ message: `${err.message}`, correlationId: req.correlationId });
  res.status(err.statusCode || 500).json({ error: err.message });
  next();
};
