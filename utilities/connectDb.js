const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config/config');

mongoose.Promise = bluebird;

module.exports = (() => {
  const db  = config.app.env === 'dev' ? 'mongodb://localhost/test' : (config.mongoUri || 'mongodb://localhost/express_prod');

  const options = {
    useMongoClient: true,
    keepAlive: 1,
    promiseLibrary: bluebird
  };

  mongoose.connection.on('error', console.log);
  mongoose.connection.on('connected', console.log)

  return mongoose.createConnection(db, options);
})();
