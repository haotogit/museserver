const express = require('express')
  router = express.Router(),
  mongoose = require('mongoose');
const logger = require('./logger'),
  authHandler = require('./auth-handler'),
  userController = require('../controllers/user'),
  serviceController = require('../controllers/service'),
  thirdPartyController = require('../controllers/third-party'),
  eventController = require('../controllers/event');

router.get('/healthcheck', serviceController.healthCheck);

//router.get('/yooo', (req, res, next) => {
//  console.log('connections', mongoose.connections[0])
//  next();
//})

router.get('/authSpotify/callback', thirdPartyController.authSpotifyCb);

router.post('/users/auth', userController.authUser);

// routes that require authentication below
router.all('*', authHandler);

router.route('/users/:id')
  .get(userController.getProfile)
  .put(userController.updateUser);

router.get('/users/:id/evalSpotify', thirdPartyController.evalSpotify);

router.route('/users/:id/events')
  .get(eventController.getUserEvents);

router.route('/users')
  .post(userController.createUser);

router.route('/thirdParty/:thirdPartyId')
  .delete(thirdPartyController.deleteThirdParty)
  .put(thirdPartyController.updateThirdParty);

router.route('/events/:id')
  .delete(eventController.deleteEvent);

router.route('/events')
  .post(eventController.createEvent);

module.exports = router;
