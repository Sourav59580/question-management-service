const topicRepository = require('../../infrastructure/repositories/topic/topic.repository');

class TopicService {
    async createTopic(payload) {
        return topicRepository.create(payload);
    }

    async getTopics(queryParams, projection = {}, options = {}) {
        const { page = 1, limit = 10, title, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (title) query.title = { $regex: title, $options: 'i' };

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const topics = await topicRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await topicRepository.count(query) || 0;

        return { total, page: parseInt(page), limit: parseInt(limit), topics };
    }

    async getTopicById(id) {
        return topicRepository.findById({ _id: id });
    }

    async updateTopic(id, payload) {
        return topicRepository.update({ _id: id }, payload);
    }

    async deleteTopic(id) {
        return topicRepository.delete({ _id: id });
    }
}

module.exports = new TopicService();
