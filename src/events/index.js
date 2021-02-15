const { EventEmitter } = require("events");

const { eventNames } = require('../utils/constants');
const { sendUserSignUpMail } = require('./mail/user');

const eventEmitter = new EventEmitter();

// User e-mail events
eventEmitter.addListener(eventNames.mailEvents.user.signUp, sendUserSignUpMail);

module.exports = eventEmitter;