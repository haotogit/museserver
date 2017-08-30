const express = require('express');
const router = express.Router();

module.exports.configRoutes = () => {
  router.get('/api/v1', (req, res) => {
    res.send({watap: 'though'});
  });

  return router;
};
