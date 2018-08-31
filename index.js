'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/config');
const router = require('./lib/router');
const errorHandler = require('./lib/error-handler');
const connectDb = require('./utilities/connectDb');
const logger = require('./utilities/logger');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDb()
  .then(() => {
    app.use('/api/v1', router);
    app.use(errorHandler);
    app.listen(config.app.host.port, (err) => {
      if (err) logger.error(`error starting server: ${err}`)
      logger.info(`Server started NODE_ENV:${config.app.env} and listening at ${config.app.host.port}`);
    }); 
  })
  .catch(err => logger.error(`Error initializing db ${err.message || err}`));
