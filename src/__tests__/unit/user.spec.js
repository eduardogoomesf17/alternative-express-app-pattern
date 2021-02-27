const status = require('http-status');

let { generatePasswordHash } = require('../../utils/password');
const responseFormatErrors = require('../../utils/formatting/error');
const userFormatFunctions = require('../../utils/formatting/index');
const { InternalError } = require("../../errors");
const UserService = require('../../resources/user/user.service');
const UserRepository = require('../../resources/user/user.repository');
const UserMocks = require('../__mocks__/user.mock');

// Utils functions mock
generatePasswordHash = jest.fn();
responseFormatErrors.formatErrorDataForResponse = jest.fn();
userFormatFunctions.formatUserData = jest.fn();

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

      responseFormatErrors.formatErrorDataForResponse.mockResolvedValue({ 
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

        userRepository.getOneByEmail.mockReturnValue('');
        generatePasswordHash.mockResolvedValue('asdsadsadsadsadsasadsa');
        userRepository.create.mockReturnValue(UserMocks.user);

        const result = await userService.createUser(UserMocks.createUser);

        expect(userRepository.create).toHaveBeenCalledWith(UserMocks.createUser);
        expect(userRepository.getOneByEmail).toHaveBeenCalledWith(UserMocks.createUser.email);
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
        generatePasswordHash.mockResolvedValue('asdsadsadsadsadsasadsa');
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

    })


  })
});