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
    const userByEmail = this.userRepository.getOneByEmail(userBody.email);

    if(userByEmail) {
      throw new InternalError("E-mail already in use", status.BAD_REQUEST);
    }

    userBody.password = await generatePasswordHash(userBody.password);

    const user = this.userRepository.create(userBody);

    if(!user) {
      throw new InternalError("Fail to create user", status.INTERNAL_SERVER_ERROR);
    }

    eventEmitter.emit(eventNames.mailEvents.user.signUp, { mail: userBody.email });

    return user;
  }

  getUserById(userId) {
    const user = this.userRepository.getOneById(userId);

    if(!user) {
      throw new InternalError("User not found", status.NOT_FOUND);
    }

    return user;
  }

  getUsers() {
    const users = this.userRepository.getAll();

    if(users.length <= 0) {
      throw new InternalError("Users not found", status.NOT_FOUND);
    } 

    return users;
  }

  getUserByEmail(userEmail) {
    const user = this.userRepository.getOneByEmail(userEmail);

    if(!user) {
      throw new InternalError("User not found", status.NOT_FOUND);
    }

    return user;
  }

  async updateUser(userId, userData) {
    const user = this.userRepository.getOneById(userId);
   
    if(!user) {
      throw new InternalError("User not found", status.NOT_FOUND);
    }

    if(userData.password) {
      userData.password = await generatePasswordHash(userData.password);
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
      throw new InternalError("Fail to delete user", status['500_MESSAGE']);
    }

    return deleteResult;
  }
 
}

module.exports = UserService;