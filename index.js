'use strict';

const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');

const config = require('./config/config');
const router = require('./library/router');
const connectDb = require('./utilities/connectDb');
//require('./tester');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.listen(config.app.port, (err) => {
  if (err) logger.log(`error starting server: ${err}`)

  winston.info(`Server started and listening at ${config.app.port}`);
}); 
