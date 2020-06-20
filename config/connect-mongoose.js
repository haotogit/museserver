'use strict';
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../utils/logger');

module.exports = () => {
  let retries = 1;
  const options = {
    promiseLibrary: bluebird,
    useNewUrlParser: true,
    useCreateIndex: true,
		useUnifiedTopology: true,
		autoIndex: false,
  };

  function connector() {
    let retryConnect;

		return new Promise((resolve, reject) => {
			mongoose.connect(config.app.db.connectionUri, options)
				.then(conn => {
					let db = conn.connections[0];
					logger.info(`Mongodb connected to ${db.client.s.url}`);
					clearTimeout(retryConnect);

					mongoose.connection.on('disconnected', () => {
						logger.error(`Mongodb connection to ${config.app.db.connectionUri} disconnected`);
					});
					resolve(db);
				},
				err => {
					logger.error(`Error initializing db ${err.message || err}`);

					if (retries <= 10) {
						logger.error(`Retrying mongodb connection to ${config.app.db.connectionUri} #${retries} in 10s`);
						retryConnect = setTimeout(connector, 5000);
						retries++;
					} else {
						logger.error(`Maxed out connection retries at ${retries-1} times. Please review mongodb connection and restart`);
						clearTimeout(retryConnect);
						reject(err);
					}
				});
		});
  }

  return connector();
};
