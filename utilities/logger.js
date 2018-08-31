const { createLogger, format, transports } = require('winston');
const { combine, label, timestamp, prettyPrint } = format;
const path = require('path');
const moment = require('moment');

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  file: {
    handleExceptions: true,
    json: true,
    colorize: false,
    maxSize: 5000000,
    maxFiles: 1
  }
};

const logger = createLogger({
  format: combine(
    timestamp({ format: moment().utc().format() }),
    prettyPrint()
  ),
  transports: [
    new transports.Console(options.console),
    new transports.File(Object.assign({}, options.file, {
      filename: path.join(__dirname, '..', 'error.log'),
      level: 'error',
    })),
    new transports.File(Object.assign({}, options.file, {
      filename: path.join(__dirname, '..', 'server.log'),
      level: 'info',
    })),
  ]
});

module.exports = logger;
