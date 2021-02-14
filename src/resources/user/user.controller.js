const status = require('http-status');

class UserController {

  constructor(UserService, UserRepository, User) {
    this.userService = new UserService(UserRepository, User);
  }

  async createUser(request, response, next) {
    try {
      const userData = request.body;

      const user = await this.userService.createUser(userData);

      return response.status(status.OK).json({ result: user });
    } catch (error) {
      return next(error);
    }
  }

  async getUsers(request, response, next) {
    try {
      const users = await this.userService.getUsers();
      
      return response.status(status.OK).json({ result: users, message: status['200_MESSAGE'] });
    } catch (error) { 
      return next(error);
    }
  }

  async getUserById(request, response, next) {
    try {
      const userId = request.params.id;

      const user = await this.userService.getUserById(userId);
      
      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

  async getUserByEmail(request, response, next) {
    try {
      const userEmail = request.params.email;

      const user = await this.userService.getUserByEmail(userEmail);
      
      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = UserController;