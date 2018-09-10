const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config/config');
const logger = require('../utilities/logger');

mongoose.Promise = bluebird;

module.exports = (() => {
  const dbUri  = config.app.env === 'dev' ? 'mongodb://localhost/test-server' : config.app.dbConnection;
  let db;
  const options = {
    useMongoClient: true,
    promiseLibrary: bluebird
  };
  
  return mongoose.connect(dbUri, options)
    .then(db => {
      logger.info(`Mongo connected to ${db.name} at port ${db.port}`);
    })
    .catch(err => logger.error(`Error initializing db ${err.message || err}`));
});
