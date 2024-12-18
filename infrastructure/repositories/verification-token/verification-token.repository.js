const VerificationToken = require("../../../domain/verification-token/verification-token.entity");
const BaseRepository = require("../base.repositories");

class VerficationToken extends BaseRepository {
  constructor() {
    super({ model: VerificationToken });
  }

  async createToken(payload) {
    const creteria = {
      userId: { $eq: payload.userId },
    }; 
    return this.update(creteria, payload, { upsert: true });
  }

  async findTokenByUserID(id, projection = {}, options = {}) {
    return this.findOne({ userId: id }, projection, options);
  }
}

module.exports = new VerficationToken();
