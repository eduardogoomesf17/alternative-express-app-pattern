const express = require('express');

const userRoutes = require('../resources/user/user.routes');

module.exports = () => {
  const app = express.Router();

  userRoutes(app);

  return app;
}

