const status = require('http-status');

const UserService = require('./user.service');
const UserRepository = require('./user.repository')
const User = require('./user.model');
const InternalError = require('../../errors');

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

  getUsers(request, response, next) {
    try {
      const users = userService.getUsers();
      
      return response.status(status.OK).json({ result: users, message: status['200_MESSAGE'] });
    } catch (error) { 
      return next(error);
    }
  }

  getUserById(request, response, next) {
    try {
      const userId = request.params.id;

      const user = userService.getUserById(userId);
      
      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

  getUserByEmail(request, response, next) {
    try {
      const userEmail = request.params.email;

      const user = userService.getUserByEmail(userEmail);
      
      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

  async updateUser(request, response, next) {
    try {
      const userId = request.params.id;
      const userData = request.body;

      await userService.updateUser(userId, userData);

      return response.status(status.OK).json({ message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

  deleteUser(request, response, next) {
    try {
      const userId = request.params.id;
      
      userService.deleteUser(userId);

      return response.status(status.OK).json({ message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

  async authenticateUser(request, response, next) {
    try {
      const { email, password } = request.body;

      const user = await userService.authenticateUser({  email, password });

      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = UserController;