const { logger } = require('../utils');

module.exports = function errorHandler(error, req, res, next) {
  logger.error({ message: `Server ERROR: ${error.message}`, correlationId: req.correlationId });
  res.status(error.statusCode || 500).json({ error: error.message });
};
