const User = require('../../../domain/users/users.entity');
const BaseRepository = require('../base.repositories');

/**
 * Repository class for handling follow-up related database operations.
 * Extends the base repository class.
 */
class UsersRepository extends BaseRepository {
    /**
     * Constructs a new instance of the follow-up repository.
     * @param {object} payload - The payload object containing the model for follow-up.
     */
    constructor(payload) {
        super(payload);
    }

    /**
     * Creates a new follow-up with the provided payload.
     * @param {object} payload - The payload object containing follow-up data.
     * @returns {Promise<object>} - A promise resolving to the created follow-up object.
     */
    async createUser(payload) {
        return this.create(payload);
    }
}

// Exporting an instance of the follow-up repository
module.exports = {
    userRepositoryObj: new UsersRepository({
        model: User,
    }),
};
