const express = require('express');
const status = require('http-status');

const User = require('./user.model');
const UserRepository = require('./user.repository');
const UserService = require('./user.service');

const routes = express.Router();

const userService = new UserService(UserRepository, User);

module.exports = (app) => {
  app.use('/users', routes);
  
  routes.get('/', async (request, response, next) => {
    try {
      const users = await userService.getUsers();
      
      return response.status(status.OK).json({ result: users, message: status['200_MESSAGE'] });
    } catch (error) { 
      return next(error);
    }
  });

  routes.get('/:id', async (request, response) => {
    try {
      const userId = request.params.id;

      const user = await userService.getUserById(userId);
      
      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  });

  routes.get('/email/:email', async (request, response) => {
    try {
      const userEmail = request.params.email;

      const user = await userService.getUserByEmail(userEmail);
      
      return response.status(status.OK).json({ result: user, message: status['200_MESSAGE'] });
    } catch (error) {
      return next(error);
    }
  });

  routes.post('/', async (request, response, next) => {
    try {
      const userData = request.body;

      const user = await userService.createUser(userData);

      return response.status(status.OK).json({ result: user });
    } catch (error) {
      return next(error);
    }
  })
  
}