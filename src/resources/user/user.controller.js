const status = require('http-status');

const UserService = require('./user.service');
const UserRepository = require('./user.repository')
const User = require('./user.model');

let userService = new UserService(UserRepository, User);

class UserController {

  async createUser(request, response, next) {
    try {
      const userData = request.body;

      const user = await userService.createUser(userData);

      return response.status(status.OK).json({ result: user });
    } catch (error) {
      return next(error);
    }
  }

  async getUsers(request, response, next) {
    try {
      const users = await userService.getUsers();
      
      return response.status(status.OK).json({ result: users, message: status['200_MESSAGE'] });
    } catch (error) { 
      return next(error);
    }
  }

  async getUserById(request, response, next) {
    try {
      const userId = request.params.id;

      const user = await userService.getUserById(userId);
      
      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

  async getUserByEmail(request, response, next) {
    try {
      const userEmail = request.params.email;

      const user = await userService.getUserByEmail(userEmail);
      
      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = UserController;