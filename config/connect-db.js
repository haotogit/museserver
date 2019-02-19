'use strict';
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('../config/config');
const logger = require('../utilities/logger');

module.exports = () => {
  const options = {
    promiseLibrary: bluebird,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoReconnect: true,
    reconnectInterval: 500,
    reconnectTries: Number.MAX_VALUE
  };

  mongoose.connection.on('disconnected', () => {
    logger.info(`Mongoose disconnected`);
    connectDb();
  });

  function connectDb() {
    return new Promise(function(resolve, reject) {
      let db;
      mongoose.connect(config.app.dbConnectionUri, options)
        .then(conn => {
          db = conn.connections[0];
          logger.info(`Mongodb connected to ${db.client.s.url}`);
          resolve(db);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  return connectDb();
};
