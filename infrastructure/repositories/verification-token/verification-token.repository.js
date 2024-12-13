const VerificationToken = require("../../../domain/verification-token/verification-token.entity");
const BaseRepository = require("../base.repositories");

class UsersRepository extends BaseRepository {
  constructor() {
    super({ model: VerificationToken });
  }

  async createUser(payload) {
    return this.create(payload);
  }

  async findTokenByUserID(id, projection = {}, options = {}) {
    return this.findOne({$where: {user_id: id}}, projection, options);
  }
}

module.exports = new UsersRepository();
