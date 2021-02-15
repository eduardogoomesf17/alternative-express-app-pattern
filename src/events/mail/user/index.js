const Logger = require('../../../loaders/logger');

const sendUserSignUpMail = async ({ mail }) => {
  try {
    Logger.info("Message sent successfully for " + mail);

  } catch (error) {
    Logger.error(error.message);
    Logger.error(error.stack);
  }
};

module.exports = {
  sendUserSignUpMail
};