const dotenv = require('dotenv');

const envFound = dotenv.config();

if(envFound.error) {
  throw new Error("Couldn't find .env file");
}

module.exports = {
  // Port where the app is running on
  app_port: process.env.APP_PORT || 3000,

  // Level for loggin with winston
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  // Prefix for api
  api: {
    prefix: "/api"
  },

  // Environment 
  app_environment: process.env.ENVIRONMENT || "DEVELOPMENT",

  // Secret key for authorization token
  token_secret_key: process.env.TOKEN_SECRET_KEY,
}