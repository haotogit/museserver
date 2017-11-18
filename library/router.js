const express = require('express');
const router = express.Router();
const logger = require('./logger');
const authHandler = require('./authHandler');
const userControl = require('../controllers/userController');
const serviceControl = require('../controllers/serviceController');

module.exports = () => {
  router.all('*', logger);

  router.all('*', authHandler);

  router.get('/', serviceControl.main);

  //router.post('/users', userControl.createUser);

  //router.get('/users/:id', userControl.getUserById);

  return router;
};

