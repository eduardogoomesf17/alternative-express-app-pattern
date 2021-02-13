const express = require('express');

const config = require('./config');
const Logger = require('./loaders/logger');
const configLoader = require('./loaders');

async function startServer() {
  const app = express();

  await configLoader(app);

  app.listen(config.app_port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.app_port} 🛡️
      ################################################
    `);
  })
  .on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
} 

startServer();