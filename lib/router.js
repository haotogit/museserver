const express = require('express');
const router = express.Router();
const logger = require('./logger');
const authHandler = require('./auth-handler');
const userController = require('../controllers/user');
const serviceController = require('../controllers/service');
const thirdPartyController = require('../controllers/third-party');

module.exports = (() => {
  router.all('*', logger);

  router.route('/healthcheck')
    .get(serviceController.healthCheck)

  router.route('/users/auth')
    .post(userController.authUser)

  router.route('/users')
    .post(userController.createUser)

  router.route('/authSpotify/callback')
    .get(thirdPartyController.authSpotifyCb)

  // routes that require authentication below
  router.all('*', authHandler);

  router.route('/users/:id')
    .get(userController.getProfile)
    .put(userController.updateUser)

  router.route('/users/:id/thirdParty')
    .post(thirdPartyController.createThirdParty)

  router.route('/users/:id/thirdParty/:thirdPartyId')
    .delete(thirdPartyController.deleteThirdParty)
    .put(thirdPartyController.updateThirdParty)

  router.route('/users/:id/evalSpotify')
    .get(thirdPartyController.evalSpotify)

  return router;
})();