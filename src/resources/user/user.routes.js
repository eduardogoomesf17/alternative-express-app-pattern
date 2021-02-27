const express = require('express');

const UserController = require('./user.controller');
const { authorizationMiddlewares } = require('../../api/middlewares/index');

const routes = express.Router();

const userController = new UserController();

module.exports = (app) => {
  app.use('/users', routes);

  routes.post('/', userController.createUser);

  routes.patch(
    '/:id', 
    authorizationMiddlewares.attachCurrentUser,
    userController.updateUser
  );

  routes.delete(
    '/:id', 
    authorizationMiddlewares.attachCurrentUser,
    userController.deleteUser
  );
  
  routes.get(
    '/', 
    authorizationMiddlewares.attachCurrentUser,
    userController.getUsers
  );

  routes.get(
    '/:id', 
    authorizationMiddlewares.attachCurrentUser,
    userController.getUserById
  );

  routes.get(
    '/email/:email', 
    authorizationMiddlewares.attachCurrentUser,
    userController.getUserByEmail
  );

  routes.post('/auth', userController.authenticateUser);
}