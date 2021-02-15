const status = require('http-status');

const InternalError = require('../../errors/');
const eventEmitter = require('../../events');
const { eventNames } = require('../../utils/constants');
const { generatePasswordHash } = require('../../utils/password');

class UserService {

  constructor(UserRepository, User) {
    this.userRepository = new UserRepository(User);
  }

  async createUser(userBody) {
    const userByEmail = await this.userRepository.getUserByEmail(userBody.email);

    if(userByEmail) {
      throw new InternalError("E-mail already in use", status.BAD_REQUEST);
    }

    userBody.password = await generatePasswordHash(userBody.password);

    const user = await this.userRepository.create(userBody);

    if(!user) {
      throw new InternalError("Fail to create user", status.INTERNAL_SERVER_ERROR);
    }

    eventEmitter.emit(eventNames.mailEvents.user.signUp, { mail: userBody.email });

    return user;
  }

  async getUserById(userId) {
    try {
      const user = await this.userRepository.getOneById(userId);

      if(!user) {
        throw new InternalError("User not found", status.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsers() {
    try {
      const users = await this.userRepository.getAll();

      if(users.length <= 0) {
        throw new InternalError("Users not found", status.NOT_FOUND);
      } 

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserByEmail(userEmail) {
    try {
      const user = await this.userRepository.getUserByEmail(userEmail);

      if(!user) {
        throw new InternalError("Users not found", status.NOT_FOUND);
      }

      return user;
    } catch (error) { 
      throw new Error(error);
    }
  }
 
}

module.exports = UserService;