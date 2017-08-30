const express = require('express');
const app = express();
const config = require('./config/config');
const router = require('./library/router');

app.use(router.configRoutes());

app.listen(config.app.port);
