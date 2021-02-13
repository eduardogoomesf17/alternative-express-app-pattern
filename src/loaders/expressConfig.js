const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const status = require('http-status');

const config = require('../config');
const routes = require('../api');

 /**
  * Load app config
  * @param {*} app
  */
const expressConfigLoader = (app) => {
   /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (request, response) => {
    response.status(status.OK).end();
  });

  app.head('/status', (request, response) => {
    response.status(status.OK).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');


  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of request.body into json
  app.use(bodyParser.json());

  // Load API Routes
  app.use(config.api.prefix, routes());

}

module.exports = expressConfigLoader;
