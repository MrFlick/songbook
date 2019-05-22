const express = require('express');
const modelSource = require('../models');

const router = express.Router();

function getRouter(sequelize) {
  const models = modelSource(sequelize);

  router.use(express.json());

  router.get('/', (req, res) => {
    res.send('hello');
  });

  // API Error Handler
  // eslint-disable-next-line consistent-return
  router.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({ message: err.message });
  });

  return router;
}

module.exports = getRouter;
