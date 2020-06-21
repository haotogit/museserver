'use strict';
const config = require('../config/config'),
	Stores = require('./'),
	{ logger, makeErr } = require('../utils');

module.exports = class StoreMachina extends Stores[config.app.db.store] {
	constructor(opts) {
		super(opts);
	}

	async init() {
		try {
			await this.connect(1);
		} catch(err) {
			logger.error(`wata ${err.message}`);
			throw err;
		}
	}

	async connect(retries) {
		let retryConnect, errMsg;
		try {
			await super.connect();
		} catch(err) {
			logger.error(`Error connecting to ${this.connStr} ${err.message || err}`);
			if (retries <= 1) {
				logger.error(`Retry attempt #${retries} to ${this.connStr} in ${this.options.retryInterval}s`);
				retries++;
				await new Promise((resolve) => retryConnect = setTimeout(resolve, this.options.retryInterval*1000));
				clearTimeout(retryConnect);
				return this.connect(retries);
			} else {
				errMsg = makeErr(`Maxed out connection retries at ${this.options.maxRetries} times. Please review mongodb connection and restart`, 400);
				logger.error(errMsg);
				return Promise.reject(errMsg);
			}
		}
	}
}
