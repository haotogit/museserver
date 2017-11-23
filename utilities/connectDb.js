const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config/config');

mongoose.Promise = bluebird;

module.exports = () => {
  const db  = config.app.env === 'dev' ? 'mongodb://localhost/test' : (config.mongoUri || 'mongodb://localhost/express_prod');

  const options = {
    useMongoClient: true,
    keepAlive: 1
  };

  mongoose.connection.on('error', console.log);

  return mongoose.createConnection(db, options)
    .then((db) => {
      console.log(`Connected to db`)
      return;
    })
    .catch((err) => {
      throw err;
    });
};
