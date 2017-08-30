const winston = require('winston');
const config = require('../config/config');
const requestHelper = require('../utilities/requestHelper');

module.exports = (req, res, next) => {
  const tsFormat = () => (new Date()).toLocaleTimeString();

  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true,
        level: config.app.logLevel
      })
    ]
  });

  logger.info(requestHelper(req));

  next();
};
