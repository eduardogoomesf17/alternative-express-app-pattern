const express = require('express');

const UserController = require('./user.controller');

const routes = express.Router();

const userController = new UserController();

module.exports = (app) => {
  app.use('/users', routes);
  
  routes.get('/', userController.getUsers);

  routes.get('/:id', userController.getUserById);

  routes.get('/email/:email', userController.getUserByEmail);

  routes.post('/', userController.createUser);

  routes.patch('/:id', userController.updateUser);

  routes.delete('/:id', userController.deleteUser);

  routes.post('/auth', userController.authenticateUser);
}