const status = require('http-status');

const { InternalError } = require('../../../errors');
const Logger = require('../../../loaders/logger');

const formatErrorDataForResponse = (err) => {
  const formattedError = {
    responseBody: "",
    statusCode: ""
  }

  if(err instanceof InternalError) {
    Logger.error(err.errorMessage);

    formattedError.statusCode = err.statusCode;

    formattedError.responseBody = {
      result: err.errorMessage,
      message: status[`${err.statusCode}_MESSAGE`] 
    }

    return formattedError;
  }

  Logger.error(err.message);
  Logger.error(err.stack);

  formattedError.statusCode = status.INTERNAL_SERVER_ERROR;

  formattedError.responseBody = {
    message: status['500_MESSAGE']
  }

  return formattedError;
}

module.exports = { formatErrorDataForResponse };