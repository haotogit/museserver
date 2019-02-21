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
  let retries = 1;

  function connector() {
    let retryConnect;
    return mongoose.connect(config.app.dbConnectionUri, options)
      .then(conn => {
        let db = conn.connections[0];
        logger.info(`Mongodb connected to ${db.client.s.url}`);
        clearTimeout(retryConnect);

        mongoose.connection.on('disconnected', () => {
          logger.error(`Mongodb connection to ${config.app.dbConnectionUri} disconnected`);
        });
      })
      .catch(err => {
        logger.error(`Error initializing db ${err.message || err}`);

        if (retries <= 10) {
          logger.error(`Retrying mongodb connection to ${config.app.dbConnectionUri} #${retries} in 10s`);
          retryConnect = setTimeout(connector, 5000);
          retries++;
        } else {
          logger.error(`Maxed out connection retries at ${retries-1} times. Please review mongodb connection and restart`);
          clearTimeout(retryConnect);
        }
      });
  }

  return connector();
};
