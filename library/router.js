const express = require('express');
const router = express.Router();
const logger = require('./logger');
const authHandler = require('./authHandler');
const userController = require('../controllers/users');
const serviceController = require('../controllers/services');
const thirdPartyController = require('../controllers/thirdParty');

module.exports = (() => {
  router.all('*', logger);

  router.route('/healthcheck')
    .get(serviceController.healthCheck)

  router.route('/users/auth')
    .get(userController.tokenCheck)
    .post(userController.authUser)

  router.route('/users')
    .post(userController.createUser)

  router.route('/authSpotify/callback')
    .get(thirdPartyController.authSpotifyCb)

  // routes that require authentication below
  router.all('*', authHandler);

  router.route('/users/:id')
    .put(userController.updateUser)

  router.route('/users/:id/thirdParty')
    .post(thirdPartyController.createThirdParty)

  router.route('/users/:id/thirdParty/:thirdPartyId')
    .delete(thirdPartyController.deleteThirdParty)
    .put(thirdPartyController.updateThirdParty)

  router.route('/users/:id/evalSpotify')
    .post(thirdPartyController.evalSpotify)

  return router;
})();

