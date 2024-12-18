const tagRepository = require('../../infrastructure/repositories/tag/tag.repository');

class TagService {
    async createTag(payload) {
        return tagRepository.create(payload);
    }

    async getTags(queryParams, projection = {}, options = {}) {
        const { page = 1, limit = 10, title, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (title) query.title = { $regex: title, $options: 'i' };

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const tags = await tagRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await tagRepository.count(query) || 0;

        return { total, page: parseInt(page), limit: parseInt(limit), tags };
    }

    async getTagById(id) {
        return tagRepository.findById({ _id: id });
    }

    async updateTag(id, payload) {
        return tagRepository.update({ _id: id }, payload);
    }

    async deleteTag(id) {
        return tagRepository.delete({ _id: id });
    }
}

module.exports = new TagService();
