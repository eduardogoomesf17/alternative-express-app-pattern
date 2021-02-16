const jwt = require('jsonwebtoken');

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

const verifyToken = (token) => {
  try {
    const tokenPayload = jwt.verify(token, config.token_secret_key);

    return tokenPayload;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { generateAuthToken, verifyToken };