const { createLogger, transports } = require('winston');
const path = require('path');
const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  }
};

const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console(options.console),
    new transports.File({
      filename: path.join(__dirname, '..', 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(__dirname, '..', 'server.log'),
    })
  ]
});

module.exports = logger;
