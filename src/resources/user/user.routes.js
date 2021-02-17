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
    authorizationMiddlewares.attachCurrenctUser,
    userController.updateUser
  );

  routes.delete(
    '/:id', 
    authorizationMiddlewares.attachCurrenctUser,
    userController.deleteUser
  );
  
  routes.get(
    '/', 
    authorizationMiddlewares.attachCurrenctUser,
    userController.getUsers
  );

  routes.get(
    '/:id', 
    authorizationMiddlewares.attachCurrenctUser,
    userController.getUserById
  );

  routes.get(
    '/email/:email', 
    authorizationMiddlewares.attachCurrenctUser,
    userController.getUserByEmail
  );

  routes.post('/auth', userController.authenticateUser);
}