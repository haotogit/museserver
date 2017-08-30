const express = require('express');
const router = express.Router();
const logger = require('./logger');
const authHandler = require('./authHandler');
const userControl = require('../controllers/user');

router.all('*', logger);

router.all('*', authHandler);

//router.post('/users', userControl.createUser);

//router.get('/users/:id', userControl.getUserById);

module.exports = router;
