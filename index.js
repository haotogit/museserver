'use strict';

const express = require('express');
const winston = require('winston');

const config = require('./config/config');
const router = require('./library/router');

const app = express();

app.use('/api/v1', router());

app.listen(config.app.port, (err) => {
  if (err) logger.log(`error starting server: ${err}`)

  winston.info(`Server started and listening at ${config.app.port}`)
});
