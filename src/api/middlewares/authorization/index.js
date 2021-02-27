const status = require('http-status');

const { InternalError } = require('../../../errors');
const { getAuthTokenPayload } = require('../../../utils/authToken');
const { responseFormatFunctions } = require('../../../utils/formatting');

const attachCurrentUser = async (request, response, next) => {
  try {
    const token = request.headers.authorization;

    if(!token) {
      throw new InternalError("Auth token is mandatory to perform this action", status.BAD_REQUEST);
    }

    const tokenPayload = getAuthTokenPayload(token);

    if(!tokenPayload) {
      throw new InternalError("Invalid token", status.BAD_REQUEST);
    }

    response.locals.user = { ...tokenPayload.user };

    return next()
  } catch (error) {
    const formattedError = responseFormatFunctions.formatErrorDataForResponse(error);

    return response.status(formattedError.statusCode).json({ ...formattedError.responseBody }); 
  }
}

module.exports = { attachCurrentUser };