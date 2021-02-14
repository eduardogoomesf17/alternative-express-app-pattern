const express = require('express');

const UserController = require('./user.controller');
const User = require('./user.model');
const UserRepository = require('./user.repository');
const UserService = require('./user.service');

const routes = express.Router();

const userController = new UserController(UserService, UserRepository, User);

module.exports = (app) => {
  app.use('/users', routes);
  
  routes.get('/', userController.getUsers);

  routes.get('/:id', userController.getUserById);

  routes.get('/email/:email', userController.getUserByEmail);

  routes.post('/', userController.createUser);
}