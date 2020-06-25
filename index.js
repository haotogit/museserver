'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/config');
const router = require('./router');
const { errorHandler, loggerMiddleware } = require('./lib');
const StoreMake = require('./store/store-config');
const { logger } = require('./utils');
const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const newStore = new StoreMake(config.app.db);
newStore.init()
	.then(() => {
		app.use(loggerMiddleware);
		app.use('/api/v1', router);
		app.use(errorHandler);
		app.listen(config.app.host.port, (err) => {
			if (err) logger.error(`error starting server: ${err}`);
			logger.info(`Server started NODE_ENV:${config.app.env} and listening at ${config.app.host.port}`);
		});
	})
	.catch(err => {
		logger.error(`Error with server init ${err.stack || err.message}`);
		process.exit(0);
	});
