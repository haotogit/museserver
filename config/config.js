module.exports = (() => {
  const config = {
    app: {
      port: process.env.PORT || 8087,
      env: process.env.NODE_ENV || 'dev',
      logLevel: process.env.LOG_LEVEL || 'debug'
    }
  };

  return config;
})();
