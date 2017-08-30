const express = require('express');
const router = express.Router();
const logger = require('./logger');
const authHandler = require('./authHandler');

module.exports.configRoutes = () => {
  router.all('*', logger);

  router.all('*', authHandler);


  return router;
};
