const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config/config');

mongoose.Promise = bluebird;

module.exports = (() => {
  const dbUri  = config.app.env === 'dev' ? 'mongodb://localhost/test-server' : (config.mongoUri || 'mongodb://localhost/express_prod');
  let db = {};

  const options = {
    useMongoClient: true,
    keepAlive: 1,
    promiseLibrary: bluebird
  };

  db = mongoose.createConnection(dbUri, options);

  db.on('error', (err) => {
    if (err) throw err;
  });

  db.once('open', () => {
    console.log(`Mongo connected to ${db.name} at port ${db.port}`);
  });

  return db;
})();
