class InternalError {

  constructor(errorMessage, statusCode) {
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }

}

module.exports = { InternalError };
