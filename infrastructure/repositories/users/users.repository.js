const User = require("../../../domain/user/user-entity");
const BaseRepository = require("../base.repositories");

class UsersRepository extends BaseRepository {
  constructor() {
    super({ model: User });
  }

  async createUser(payload, options) {
    return this.create(payload);
  }

  async findUserByEmail(email, projection = {}, options = {}) {
    return User.findOne({ email }, projection, options);
  }

  async updateUser(id, payload, options = {}) {
    const criteria = {
      _id: { $eq: id },
    };
    return this.update(criteria, payload, options);
  }
}

module.exports = new UsersRepository();
