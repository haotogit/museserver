'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/config');
const router = require('./router');
const errorHandler = require('./lib/error-handler');
const connectDB = require('./config/connect-mongoose');
const logMiddleware = require('./lib/logger');
const logger = require('./utils/logger');
const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connectDB()
	.then(() => {
		app.use(logMiddleware);
		app.use(errorHandler);
		app.use('/api/v1', router);
		app.listen(config.app.host.port, (err) => {
			if (err) logger.error(`error starting server: ${err}`);
			logger.info(`Server started NODE_ENV:${config.app.env} and listening at ${config.app.host.port}`);
		});
	})
	.catch(err => {
		logger.error(`Error with server init ${err.stack || err.message}`);
		process.exit(1);
	});
