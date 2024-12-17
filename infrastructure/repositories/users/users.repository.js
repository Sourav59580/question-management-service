const User = require("../../../domain/user/user-entity");
const BaseRepository = require("../base.repositories");

class UsersRepository extends BaseRepository {
  constructor() {
    super({ model: User });
  }

  async createUser(payload, options) {
    return this.create(payload);
  }

  async findAllUsers(projection = {}, options = {}) {
    return this.find({}, projection, options);
  }

  async findUserByEmail(email, projection = {}, options = {}) {
    return this.model.findOne({ email }, projection, options);
  }

  async findUserById(id, projection = {}, options = {}) {
    const creteria = {
      _id: { $eq: id },
    };
    return this.findOne(creteria, projection, options);
  }

  async updateUser(id, payload, options = {}) {
    const criteria = {
      _id: { $eq: id },
    };
    return this.update(criteria, payload, options);
  }

  async deleteUser(query, options = {}) {
    return this.delete(query, options);
  }
}

module.exports = new UsersRepository();
