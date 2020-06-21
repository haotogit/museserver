const bluebird = require('bluebird');
const mongoose = require('mongoose');
const config = require('../config/config');
const { logger } = require('../utils');
mongoose.Promise = bluebird;

module.exports = class MongoDB {
	constructor(opts) {
		this.connStr = opts.connStr;
		this.options = opts.options;
	}

	connect() {
		const settings = {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			autoIndex: false,
		};

		return new Promise((resolve, reject) => {
			mongoose.connect(this.connStr, settings)
				.then(conn => {
					let db = conn.connections[0];
					logger.info(`Mongodb connected to ${db.client.s.url}`);
					mongoose.connection.on('disconnected', () => {
						logger.error(`Mongodb connection to ${this.connStr} disconnected`);
					});

					resolve();
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}
