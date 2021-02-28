const status = require('http-status');

const { InternalError } = require('../../errors/');
const userEvents = require('../..//events/mail/user');
// const { generatePasswordHash, comparePassword } = require('../../utils/password');
const passwords = require('../../utils/password');
const tokens = require('../../utils/authToken');
const { userFormatFunctions } = require('../../utils/formatting/index');

class UserService {

  constructor(UserRepository) {
    this.userRepository = UserRepository;
  }

  async createUser(userBody) {
    const userByEmail = this.userRepository.getOneByEmail(userBody.email);

    if(userByEmail) {
      throw new InternalError("E-mail already in use", status.BAD_REQUEST);
    }

    userBody.password = await passwords.generatePasswordHash(userBody.password);

    const user = this.userRepository.create(userBody);

    if(!user) {
      throw new InternalError("Fail to create user", status.INTERNAL_SERVER_ERROR);
    }

    userEvents.userEventEmitter.emit(
      userEvents.userEventsName.user.signUp, 
      { mail: userBody.email }
    );

    const formattedUserData = userFormatFunctions.formatUserData(user);

    return formattedUserData;
  }

  getUserById(userId) {
    const user = this.userRepository.getOneById(userId);

    if(!user) {
      throw new InternalError("User not found", status.NOT_FOUND);
    }

    const formattedUserData = userFormatFunctions.formatUserData(user);

    return formattedUserData;
  }

  getUsers() {
    const users = this.userRepository.getAll();

    if(users.length <= 0) {
      throw new InternalError("Users not found", status.NOT_FOUND);
    } 

    const formattedUsers = userFormatFunctions.formatUsersData(users);

    return formattedUsers;
  }

  getUserByEmail(userEmail) {
    const user = this.userRepository.getOneByEmail(userEmail);

    if(!user) {
      throw new InternalError("User not found", status.NOT_FOUND);
    }

    const formattedUserData = userFormatFunctions.formatUserData(user);

    return formattedUserData;
  }

  async updateUser(userId, userData) {
    const user = this.userRepository.getOneById(userId);
   
    if(!user) {
      throw new InternalError("User not found", status.NOT_FOUND);
    }

    if(userData.password) {
      userData.password = await passwords.generatePasswordHash(userData.password);
    }

    const updateResult = this.userRepository.updateOne(userId, userData);

    if(!updateResult) {
      throw new InternalError("Fail to update user", status.INTERNAL_SERVER_ERROR);
    }

    return updateResult;
  }

  deleteUser(userId) {
    const user = this.userRepository.getOneById(userId);

    if(!user) {
      throw new InternalError("User not found", status.NOT_FOUND);
    }

    const deleteResult = this.userRepository.deleteOne(userId);

    if(!deleteResult) {
      throw new InternalError("Fail to delete user", status.INTERNAL_SERVER_ERROR);
    }

    return deleteResult;
  }

  async authenticateUser({ email, password }) {
    const invalidUserMessage = "Invalid e-mail and/or password";
    
    const user = this.userRepository.getOneByEmail(email);

    if(!user) {
      throw new InternalError(invalidUserMessage, status.BAD_REQUEST);
    }

    const isPasswordValid = await passwords.comparePassword(password, user.password);
    
    if(!isPasswordValid) {
      throw new InternalError(invalidUserMessage, status.BAD_REQUEST);
    }

    const formattedUserData = userFormatFunctions.formatUserData(user);

    const token = tokens.generateAuthToken(
      { 
        id: user.id,
        name: user.name,
        email: user.email
      },
      '3d'
    );

    return { user: formattedUserData , token };
  }
 
}

module.exports = UserService;