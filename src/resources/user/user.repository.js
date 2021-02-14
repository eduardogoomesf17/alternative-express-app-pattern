class UserRepository {

  constructor(Model) {
    this.User = new Model();
  }

  async create(userBody) {
    try {
      const user = await this.User.create(userBody);

      return user;
    } catch (error) {
      throw new Error();
    }
  }

  async getOneById(userId) {
    try {
      const user = await this.User.findByPk(userId);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      const users = await this.User.findAll();

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserByEmail(userEmail) {
    try {
      const user = await this.User.findByEmail(userEmail);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

}

module.exports = UserRepository;