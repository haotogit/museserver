const logger = require('./logger');

module.exports = (err, res, correlationId) => {
  let error = { error: { message: err.message }, correlationId };
  logger.error(err);
  res.status(err.statusCode || 500).json(error);
}
