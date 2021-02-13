class UserService {

  constructor(Repository, Model) {
    this.UserRepository = new Repository(Model);
  }

  async createUser(userBody) {
    try {
      const user = await this.UserRepository.create(userBody);

      if(!user) {
        throw new Error("Fail to create user");
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.UserRepository.getOneById(userId);

      if(!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsers() {
    try {
      const users = await this.UserRepository.getAll();

      if(users.length <= 0) {
        throw new Error("Users not found");
      } 

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserByEmail(userEmail) {
    try {
      const user = await this.UserRepository.getUserByEmail(userEmail);

      return user;
    } catch (error) { 
      throw new Error(error);
    }
  }
 
}

module.exports = UserService;