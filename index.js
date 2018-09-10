'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const router = require('./lib/router');
const errorHandler = require('./lib/error-handler');
const connectDb = require('./config/connect-db');
const logger = require('./utilities/logger');
const app = express();

//app.use((req, res, next) => {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//  next();
//});
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connectDb()
  .then(() => {
    app.use('/api/v1', router);
    app.use(errorHandler);
    app.listen(config.app.host.port, (err) => {
      if (err) logger.error(`error starting server: ${err}`);
      logger.info(`Server started NODE_ENV:${config.app.env} and listening at ${config.app.host.port}`);
    }); 
  });
