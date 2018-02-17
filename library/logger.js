const uuid = require('uuid/v4');
const winston = require('winston');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const tsFormat = () => (new Date()).toLocaleTimeString();
  const correlationId = uuid();

  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true,
        level: config.app.logLevel,
        json: true
      })
    ]
  });

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
