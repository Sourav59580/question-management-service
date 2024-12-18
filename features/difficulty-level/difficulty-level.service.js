const difficultyLevelRepository = require('../../infrastructure/repositories/difficulty-level/difficulty-level.repository');

class DifficultyLevelService {
    async createDifficultyLevel(payload) {
        return difficultyLevelRepository.create(payload);
    }

    async getDifficultyLevels(queryParams, projection = {}, options = {}) {
        const { page = 1, limit = 10, title, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (title) query.title = { $regex: title, $options: 'i' };  

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const difficultyLevels = await difficultyLevelRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await difficultyLevelRepository.count(query) || 0;

        return { total, page: parseInt(page), limit: parseInt(limit), difficultyLevels };
    }

    async getDifficultyLevelById(id) {
        return difficultyLevelRepository.findById({ _id: id });
    }

    async updateDifficultyLevel(id, payload) {
        return difficultyLevelRepository.update({ _id: id }, payload);
    }

    async deleteDifficultyLevel(id) {
        return difficultyLevelRepository.delete({ _id: id });
    }
}

module.exports = new DifficultyLevelService();
