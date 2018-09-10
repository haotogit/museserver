const uuid = require('uuid/v4');
const logger = require('../utilities/logger');
const config = require('../config/config');

module.exports = (req, res, next) => {
  logger.info('thefuk====', req)
  const sourceHost = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    req.connection.socket.remoteAddress;
  const correlationId = uuid();
  const loggerObj = {
    message: 'INCOMING_REQUEST',
    path: req.url,
    method: req.method,
    sourceHost,
    correlationId
  };

  if (req.body) loggerObj.body = req.body;
  logger.info(loggerObj);
  req.correlationId = correlationId;
  next();
};
