class UserRepository {

  constructor(User) {
    this.User = User;
  }

  create(userBody) {
    try {
      const user = this.User.create(userBody);

      return user;
    } catch (error) {
      throw new Error();
    }
  }

  getOneById(userId) {
    try {
      const user = this.User.findByPk(userId);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  getAll() {
    try {
      const users = this.User.findAll();

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  getOneByEmail(userEmail) {
    try {
      const user = this.User.findByEmail(userEmail);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  updateOne(userId, userData) {
    try {
      const user = this.User.updateOne(userId, userData);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  deleteOne(userId) {
    try {
      const user = this.User.deleteOne(userId);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

}

module.exports = UserRepository;