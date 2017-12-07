module.exports = (() => {
  const config = {
    app: {
      port: process.env.PORT || 8087,
      env: process.env.NODE_ENV || 'dev',
      logLevel: process.env.LOG_LEVEL || 'debug',
      tokenSecret: process.env.TOKEN_SECRET || 'asdf'
    },
    external: {
      spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        tokenEndpoint: process.env.SPOTIFY_AUTH_ENDPOINT,
      }
    }
  };

  return config;
})();
