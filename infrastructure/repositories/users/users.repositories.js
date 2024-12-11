const User = require('../../../domain/users/users.entity');
const BaseRepository = require('../base.repositories');

/**
 * Repository class for handling user related database operations.
 * Extends the base repository class.
 */
class UsersRepository extends BaseRepository {
    /**
     * Constructs a new instance of the user repository.
     * @param {object} payload - The payload object containing the model for user.
     */
    constructor(payload) {
        super(payload);
    }

    /**
     * Creates a new user with the provided payload.
     * @param {object} payload - The payload object containing user data.
     * @returns {Promise<object>} - A promise resolving to the created user object.
     */
    async createUser(payload, options) {
        return this.create(payload);
    }

    /**
     * Finds a user with the provided email.
     * @param {string} email - The email of the user to find.
     * @returns {Promise<object>} - A promise resolving to the found user object.
     */
    async findUserByEmail(email, projection = {}, options = {}) {
        return this.find_by_id({email}, projection, options);
    }

    /**
     * Updates a user identified by its ID with the provided payload and options.
     * @param {string} email - The ID of the user to update.
     * @param {object} payload - The payload object containing the update data.
     * @param {object} options - Additional options for the update operation.
     * @returns {Promise<object|null>} - A promise resolving to the updated user or null if not found.
     */
    async updateUser(id, payload, options = {}) {
        const criteria = {
            _id: { $eq: id },
        };
        return this.update(criteria, payload, options);
    }

}

// Exporting an instance of the user repository
module.exports = {
    userRepositoryObj: new UsersRepository({
        model: User,
    }),
};
