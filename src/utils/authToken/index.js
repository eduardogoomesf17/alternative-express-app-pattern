const jwt = require('jsonwebtoken');
const status = require('http-status');

const { InternalError } = require('../../errors/index');
const config = require('../../config');

const generateAuthToken = (tokenPayload, expirationTime) => {
  try {
    const token = jwt.sign(
      { ...tokenPayload },
      config.token_secret_key,
      {
        expiresIn: expirationTime
      }
    );

    return token;
  } catch (error) {
    throw new Error(error);
  }
}

const getAuthTokenPayload = (token) => {
  try {
    const tokenPayload = jwt.verify(token, config.token_secret_key);

    return tokenPayload;
  } catch (error) {
    throw new InternalError("Token is either invalid or expired", status.BAD_REQUEST);
  }
}

module.exports = { generateAuthToken, getAuthTokenPayload };