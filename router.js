const express = require('express')
  router = express.Router();
const { authHandler } = require('./lib'),
  userControl = require('./controllers/user'),
  serviceControl = require('./controllers/service'),
  thirdPartyControl = require('./controllers/third-party'),
	eventControl = require('./controllers/event'),
	{ logger } = require('./utils');

router.get('/healthcheck', serviceControl.healthCheck);
router.get('/authSpotify/callback', thirdPartyControl.authSpotifyCb);
router.get('/linkSpotify', thirdPartyControl.linkSpotify);

router.post('/username', userControl.checkUsername);
router.post('/users/auth', userControl.authUser);
router.route('/users')
  .post(userControl.createUser);

// routes that require authentication below
router.all('*', authHandler);

router.route('/users/:id')
  .get(userControl.getProfile)
  .put(userControl.updateUser);

router.get('/users/:id/evalSpotify', thirdPartyControl.evalSpotify);

router.route('/users/:id/events')
  .get(eventControl.getUserEvents);

router.route('/thirdParty/:thirdPartyId')
  .delete(thirdPartyControl.deleteThirdParty)
  .put(thirdPartyControl.updateThirdParty);

router.route('/events/:id')
  .delete(eventControl.deleteEvent);

router.route('/events')
  .post(eventControl.createEvent);

module.exports = router;
