const express = require('express');
const router = express.Router();
const logger = require('./logger'),
  authHandler = require('./auth-handler'),
  userController = require('../controllers/user'),
  serviceController = require('../controllers/service'),
  thirdPartyController = require('../controllers/third-party'),
  eventController = require('../controllers/event');

module.exports = (() => {
  router.all('*', logger);

  router.route('/healthcheck')
    .get(serviceController.healthCheck);

  router.route('/users/auth')
    .post(userController.authUser);

  router.route('/users')
    .post(userController.createUser);

  router.route('/authSpotify/callback')
    .get(thirdPartyController.authSpotifyCb);

  // routes that require authentication below
  router.all('*', authHandler);

  router.route('/users/:id')
    .get(userController.getProfile)
    .put(userController.updateUser);

  router.route('/users/:id/evalSpotify')
    .get(thirdPartyController.evalSpotify);

  router.route('/users/:id/events')
    .get(eventController.getUserEvents);

  router.route('/thirdParty/:thirdPartyId')
    .delete(thirdPartyController.deleteThirdParty)
    .put(thirdPartyController.updateThirdParty);

  router.route('/events')
    .post(eventController.createEvent);

  router.route('/events/:id')
    .delete(eventController.deleteEvent);

  return router;
})();
