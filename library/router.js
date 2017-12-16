const express = require('express');
const router = express.Router();
const logger = require('./logger');
const authHandler = require('./authHandler');
const userController = require('../controllers/users');
const serviceController = require('../controllers/services');

module.exports = (() => {
  router.all('*', logger);

  router.all('*', authHandler);

  router.route('/healthcheck')
    .get(serviceController.healthCheck)

  router.route('/users/auth')
    .post(userController.authUser)

  router.route('/users')
    .post(userController.createUser)

  router.route('/users/:id')
    .put(userController.updateUser)

  router.route('/users/:id/thirdParty')
    .post(serviceController.createThirdParty)

  return router;
})();

