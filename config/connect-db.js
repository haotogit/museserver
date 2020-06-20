'use strict';
const { MongoClient } = require('mongodb');
const config = require('../config/config');
const logger = require('../utils/logger');

module.exports.connect = async function connect() {
	let retryConnect, db;
  let retries = 1;
	try {
		const client = new MongoClient(config.app.db.connectionUri, { useNewUrlParser: true });
		await client.connect();
		db = client.db(config.app.db.Name)
		logger.info(`Mongodb connected to ${config.app.db.connectionUri}`);
		clearTimeout(retryConnect);
		return;
	} catch(err) {
		logger.error(`Error connecting to ${config.app.db.connectionUri} ${err.message || err}`);
		if (retries <= 10) {
			logger.error(`Retrying mongodb connection to ${config.app.db.connectionUri} #${retries} in 10s`);
			retries++;
			retryConnect = setTimeout(exports.connector, 5000);
		} else {
			logger.error(`Maxed out connection retries at ${retries-1} times. Please review mongodb connection and restart`);
			clearTimeout(retryConnect);
			process.exit(1)
		}
	}
};
