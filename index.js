'use strict';

const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');

const config = require('./config/config');
const router = require('./library/router');
const connectDb = require('./utilities/connectDb');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/v1', router);

app.listen(config.app.port, (err) => {
  if (err) logger.log(`error starting server: ${err}`)

  winston.info(`Server started and listening at ${config.app.port}`)
}); 
