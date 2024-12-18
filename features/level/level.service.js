const levelRepository = require('../../infrastructure/repositories/level/level.repository'); 

class LevelService {
    async createLevel(payload) {
        return levelRepository.create(payload);
    }

    async getLevels(queryParams, projection = {}, options = {}) {
        const { page = 1, limit = 10, title, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (title) query.title = { $regex: title, $options: 'i' };  

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const levels = await levelRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await levelRepository.count(query) || 0;

        return { total, page: parseInt(page), limit: parseInt(limit), levels };
    }

    async getLevelById(id) {
        return levelRepository.findById({ _id: id });
    }

    async updateLevel(id, payload) {
        return levelRepository.update({ _id: id }, payload);
    }

    async deleteLevel(id) {
        return levelRepository.delete({ _id: id });
    }
}


module.exports = new LevelService();
