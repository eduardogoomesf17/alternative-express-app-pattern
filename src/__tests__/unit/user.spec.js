const status = require('http-status');

const passwords = require('../../utils/password/index');
const tokens = require('../../utils/authToken');
const responseFormatErrors = require('../../utils/formatting/error');
const { userFormatFunctions } = require('../../utils/formatting/index');
const { InternalError } = require("../../errors");
const UserService = require('../../resources/user/user.service');
const UserRepository = require('../../resources/user/user.repository');
const UserMocks = require('../__mocks__/user.mock');
const { format } = require('../../loaders/logger');

// Dependency mocks
const userRepository = {
  create: jest.fn(),
  getOneById: jest.fn(),
  getOneByEmail: jest.fn(),
  getAll: jest.fn(),
  deleteOne: jest.fn(),
  updateOne: jest.fn()
}

const User = {
  create: jest.fn(),
  findByPk: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn()
}

describe("User CRUD", () => {

  describe("User controller test", () => {
    let userService;

    beforeEach(() => {
      userService = new UserService(userRepository);

      responseFormatErrors.formatErrorDataForResponse = jest.fn();
      userFormatFunctions.formatUserData = jest.fn();
      userFormatFunctions.formatUsersData = jest.fn();
      passwords.generatePasswordHash = jest.fn();
      passwords.comparePassword = jest.fn();
      tokens.generateAuthToken = jest.fn();

      userFormatFunctions.formatUserData.mockResolvedValue({ 
        id: UserMocks.user.id,
        name: UserMocks.user.name,
        email: UserMocks.user.email
      });

    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe("#create", () => {

      it("should be able to create an new user", async () => {
        const expectedResult = { 
          id: UserMocks.user.id,
          name: UserMocks.user.name,
          email: UserMocks.user.email
        };

        userFormatFunctions.formatUserData.mockReturnValue(expectedResult);
        userRepository.getOneByEmail.mockReturnValue('');
        passwords.generatePasswordHash.mockResolvedValue('asdsadsadsadsadsasadsa');
        userRepository.create.mockReturnValue(UserMocks.user);

        const result = await userService.createUser(UserMocks.createUser);

        expect(userFormatFunctions.formatUserData).toHaveBeenCalledWith(UserMocks.user);
        expect(userRepository.create).toHaveBeenCalledWith(UserMocks.createUser);
        expect(userRepository.getOneByEmail).toHaveBeenCalledWith(UserMocks.createUser.email);
        expect(passwords.generatePasswordHash).toHaveBeenCalled();
        expect(result).toStrictEqual(expectedResult);
        expect(result).toHaveProperty('id', UserMocks.user.id);
      });
      
      it("should not be able to create an user with an e-mail that is already in use", async () => {
        userRepository.getOneByEmail.mockReturnValue(UserMocks.user);

        try {
          await userService.createUser(UserMocks.createUser);

        } catch (error) {
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "E-mail already in use");
          expect(error).toHaveProperty("statusCode", status.BAD_REQUEST);
        }
      });

      it("should catch an exception if the user was not successfully created", async () => {
        userRepository.getOneByEmail.mockReturnValue('');
        passwords.generatePasswordHash.mockResolvedValue('asdsadsadsadsadsasadsa');
        userRepository.create.mockReturnValue("");

        try {
          await userService.createUser(UserMocks.createUser);

        } catch (error) {
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "Fail to create user");
          expect(error).toHaveProperty("statusCode", status.INTERNAL_SERVER_ERROR);
        }

      });
    });

    describe("#getUserById", () => {

      it("should be able to get an user by id", async () => {
        const expectedResult = { 
          id: UserMocks.user.id,
          name: UserMocks.user.name,
          email: UserMocks.user.email
        };
        
        userRepository.getOneById.mockReturnValue(UserMocks.user);

        const result = await userService.getUserById(UserMocks.user.id);

        expect(userRepository.getOneById).toHaveBeenCalledWith(UserMocks.user.id);
        expect(result).toStrictEqual(expectedResult);
        expect(result).toHaveProperty('id', UserMocks.user.id);
      });

      it("should not be able to get an user with the wrong id", async () => {
        userRepository.getOneById.mockReturnValue("");

        try {
          await userService.getUserById(UserMocks.user.id);
      
        } catch (error) {
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "User not found");
          expect(error).toHaveProperty("statusCode", status.NOT_FOUND);
        }
      });

    });

    describe("#getUserByEmail", () => {

      it("should be able to get an user by e-mail", async () => {
        const expectedResult = {
          id: UserMocks.user.id,
          name: UserMocks.user.name,
          email: UserMocks.user.email
        }

        userRepository.getOneByEmail.mockReturnValue(UserMocks.user);

        const result = await userService.getUserByEmail(UserMocks.user.email);

        expect(userRepository.getOneByEmail).toHaveBeenCalledWith(UserMocks.user.email);
        expect(result).toStrictEqual(expectedResult);
        expect(result).toHaveProperty("id", UserMocks.user.id);
        expect(result).toHaveProperty("email", UserMocks.user.email);
      });

      it("should not be able to get an user with the wrong e-mail", async () => {
        userRepository.getOneByEmail.mockReturnValue('');

        try {
          await userService.getUserByEmail(UserMocks.user.email);

        } catch (error) { 
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "User not found");
          expect(error).toHaveProperty("statusCode", status.NOT_FOUND);
        }

      });
      
    });

    describe("#getUsers", () => {

      it("should be able to get users", async () => {
        const formattedObject = { 
          id: UserMocks.user.id, name: 
          UserMocks.user.name, email: 
          UserMocks.user.email 
        };

        const expectedResult = [formattedObject, formattedObject];

        userRepository.getAll.mockReturnValue(UserMocks.users);
        userFormatFunctions.formatUsersData.mockReturnValue(expectedResult);

        const result = await userService.getUsers();

        expect(userFormatFunctions.formatUsersData).toHaveBeenCalledWith(UserMocks.users);
        expect(userRepository.getAll).toHaveBeenCalledTimes(1);
        expect(userFormatFunctions.formatUsersData).toHaveBeenCalledWith(UserMocks.users);
        expect(result).toEqual(expect.arrayContaining(expectedResult));
      });

      it("should not be able to get users", async () => {
        userRepository.getAll.mockReturnValue("");

        try {
          await userService.getUsers();

        } catch (error) {
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "Users not found");
          expect(error).toHaveProperty("statusCode", status.NOT_FOUND);
        }
      });

    });

    describe("#updateUser", () => {

      it("should be able to update an user", async () => {
        userRepository.getOneById.mockReturnValue(UserMocks.user);
        userRepository.updateOne.mockReturnValue(UserMocks.userUpdated);
        
        const result = await userService.updateUser(UserMocks.user.id, UserMocks.updateUser);

        expect(result).toStrictEqual(UserMocks.userUpdated);
        expect(result).toHaveProperty("name", UserMocks.userUpdated.name);
        expect(userRepository.getOneById).toHaveBeenCalledWith(UserMocks.user.id);
        expect(userRepository.updateOne).toHaveBeenCalledWith(UserMocks.user.id, UserMocks.updateUser);
      });

      it("should be able to update an user including its password", async () => {
        const newPassword = 'ytrewq';

        const userWithNewPassword = { ...UserMocks.updateUser, password: newPassword };        

        const newPasswordHash = 'sahdudsaasdaassdsdashudas';

        const beenCalledWith = {
          ...UserMocks.updateUser,
          password: newPasswordHash
        }

        userRepository.getOneById.mockReturnValue(UserMocks.user);
        userRepository.updateOne.mockReturnValue(UserMocks.userUpdated);
        passwords.generatePasswordHash.mockResolvedValue(newPasswordHash);
        
        const result = await userService.updateUser(UserMocks.user.id, userWithNewPassword);

        expect(result).toStrictEqual(UserMocks.userUpdated);
        expect(result).toHaveProperty("name", UserMocks.userUpdated.name);
        expect(passwords.generatePasswordHash).toHaveBeenCalledWith(newPassword);
        expect(userRepository.getOneById).toHaveBeenCalledWith(UserMocks.user.id);
        expect(userRepository.updateOne).toHaveBeenCalledWith(UserMocks.user.id, beenCalledWith);

      });

      it("should not be able to update an user that does not exist", async () => {
        userRepository.getOneById.mockReturnValue('');

        try {
          await userService.updateUser(UserMocks.user.id, UserMocks.updateUser);

        } catch (error) {
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty('errorMessage', "User not found");
          expect(error).toHaveProperty("statusCode", status.NOT_FOUND);
        }
      });

      it("should throw an exception if the user was not successfully updated", async () => {
        userRepository.getOneById.mockReturnValue(UserMocks.user);
        userRepository.updateOne.mockReturnValue('')
        
        try {
          await userService.updateUser(UserMocks.user.id, UserMocks.updateUser);

        } catch (error) {
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty('errorMessage', "Fail to update user");
          expect(error).toHaveProperty("statusCode", status.INTERNAL_SERVER_ERROR);
        }
        
      });

    });

    describe("#deleteUser", () => {

      it("should be able to delete an user", async () => {
        const expectedResult = "succesfully deleted!";

        userRepository.getOneById.mockReturnValue(UserMocks.user);
        userRepository.deleteOne.mockReturnValue(expectedResult);


        const result = await userService.deleteUser(UserMocks.user.id);

        expect(userRepository.getOneById).toHaveBeenCalledWith(UserMocks.user.id);
        expect(userRepository.deleteOne).toHaveBeenCalledWith(UserMocks.user.id);
        expect(result).toBe(expectedResult);
      });

      it("should not be able to delete an user that does not exist", async () => {
        userRepository.getOneById.mockReturnValue("");

        try {
          await userService.deleteUser(UserMocks.user.id);

        } catch (error) {
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "User not found");
          expect(error).toHaveProperty("statusCode", status.NOT_FOUND);
        }
      });

      it("should throw an exception if the user was not successfully deleted", async () => {
        userRepository.getOneById.mockReturnValue(UserMocks.user);
        userRepository.deleteOne.mockReturnValue("");

        try {
          await userService.deleteUser(UserMocks.user.id);

        } catch (error) {
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "Fail to delete user");
          expect(error).toHaveProperty("statusCode", status.INTERNAL_SERVER_ERROR);
        }

      });
    });

    describe("#authenticateUser", () => {

      it("should be able to authenticate with the correct e-mail and password", async () => {
        const token = "sdasdasdasdsadsa";

        const formattedUser = {
          id: UserMocks.user.id,
          name: UserMocks.user.name,
          email: UserMocks.user.email
        }

        const expectedResult = {
          user: formattedUser,
          token: token
        }

        userRepository.getOneByEmail.mockReturnValue(UserMocks.user);
        passwords.comparePassword.mockReturnValue(true);
        userFormatFunctions.formatUserData.mockReturnValue(formattedUser);
        tokens.generateAuthToken.mockReturnValue(token);

        const result = await userService.authenticateUser({ 
          email: UserMocks.user.email, 
          password: UserMocks.user.password
        });

        expect(userRepository.getOneByEmail).toHaveBeenCalledWith(UserMocks.user.email);
        expect(passwords.comparePassword).toHaveBeenCalledWith(UserMocks.user.password, UserMocks.user.password);
        expect(userFormatFunctions.formatUserData).toHaveBeenCalledWith(UserMocks.user);
        expect(tokens.generateAuthToken).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(expectedResult);
      });

      it("should not be able to authenticate with the wrong e-mail", async () => {
        userRepository.getOneByEmail.mockReturnValue("");

        try {
          await userService.authenticateUser({ 
            email: UserMocks.user.email, 
            password: UserMocks.user.password
          });

        } catch (error) {
          expect(userRepository.getOneByEmail).toHaveBeenCalledWith(UserMocks.user.email);
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "Invalid e-mail and/or password");
          expect(error).toHaveProperty("statusCode", status.BAD_REQUEST);
        }
      });
      
      it("should not be able to authenticate with the wrong password", async () => {
        userRepository.getOneByEmail.mockReturnValue(UserMocks.user);
        passwords.comparePassword.mockReturnValue(false);

        try {
          await userService.authenticateUser({ 
            email: UserMocks.user.email, 
            password: UserMocks.user.password
          });

        } catch (error) {
          expect(userRepository.getOneByEmail).toHaveBeenCalledWith(UserMocks.user.email);
          expect(error).toBeInstanceOf(InternalError);
          expect(error).toHaveProperty("errorMessage", "Invalid e-mail and/or password");
          expect(error).toHaveProperty("statusCode", status.BAD_REQUEST);
        }
      });

    });

  })
});