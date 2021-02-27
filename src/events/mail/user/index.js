const { EventEmitter } = require('events');

const Logger = require('../../../loaders/logger');

const userEventsName = {

  user: {
    signUp: "user-sign-up-mail"
  }
}

const userEventEmitter = new EventEmitter();

userEventEmitter.addListener(userEventsName.user.signUp, ({ mail }) => {
  try {
    Logger.info("Message sent successfully to " + mail);

  } catch (error) {
    Logger.error(error.message);
    Logger.error(error.stack);
  }
});

module.exports = {
  userEventEmitter,
  userEventsName
};