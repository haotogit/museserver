const logger = require('./logger');

module.exports = (err, res) => {
  let error = { error: { message: err.message } };
  logger.error(error);
  res.status(err.statusCode || 500).json(error);
}
