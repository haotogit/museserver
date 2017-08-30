module.exports = {
  "app": {
    "port": process.env.PORT || 8080,
    "env": process.env.NODE_ENV || 'dev',
    "logLevel": process.env.LOG_LEVEL || 'debug'
  }
};
