const status = require('http-status');

const InternalError = require('../../errors/');

class UserService {

  constructor(Repository, Model) {
    this.UserRepository = new Repository(Model);
  }

  async createUser(userBody) {
    const userByEmail = await this.UserRepository.getUserByEmail(userBody.email);

    if(userByEmail) {
      throw new InternalError("E-mail already in use", status.BAD_REQUEST);
    }

    const user = await this.UserRepository.create(userBody);

    if(!user) {
      throw new InternalError("Fail to create user", status.INTERNAL_SERVER_ERROR);
    }

    return user;
  }

  async getUserById(userId) {
    try {
      const user = await this.UserRepository.getOneById(userId);

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
      const users = await this.UserRepository.getAll();

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
      const user = await this.UserRepository.getUserByEmail(userEmail);

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