'use strict';

const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/config');
const router = require('./library/router');
const connectDb = require('./utilities/connectDb');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', router);

connectDb()
  .then((db) => {
    app.listen(config.app.host.port, (err) => {
      if (err) logger.log(`error starting server: ${err}`)

      winston.info(`Server started and listening at ${config.app.host.port}`);
    }); 
  })
  .catch(err => winston.error(`Error initializing server ${err.message || err}`);
