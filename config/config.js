module.exports = (() => {
  const config = {
    app: {
      env: process.env.NODE_ENV || 'dev',
      logLevel: process.env.LOG_LEVEL || 'debug',
      tokenSecret: process.env.TOKEN_SECRET || 'asdf',
      //dbConnectionUri: process.env.MONGO_URI || 'mongodb://mongo:27017/tester',
			db: {
				connectionUri: process.env.MONGO_URI || 'mongodb://localhost:27017/test-server',
				name: process.env.MONGO_DBNAME || 'test-server',
			},
      host: {
        protocol: process.env.SERVER_PROTOCOL || 'http',
        hostname: process.env.SERVER_HOSTNAME || 'localhost',
        port: process.env.SERVER_PORT || 8087
      },
      client: {
        protocol: process.env.SERVER_PROTOCOL || 'http',
        hostname: process.env.SERVER_HOSTNAME || 'localhost',
        port: process.env.SERVER_PORT || 8080
      },
      security: process.env.SERVER_SECURITY || false
    },
    external: {
      spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        baseUrl: 'https://api.spotify.com/v1',
        redirectUri: process.env.SPOTIFY_REDIRECT_URI || '',
        authUri: process.env.SPOTIFY_AUTH_URI
      },
      ticketmaster: {
        baseUrl: process.env.TICKETMASTER_URL,
        apiKey: process.env.TICKETMASTER_KEY
      }
    }
  };

  return config;
})();
