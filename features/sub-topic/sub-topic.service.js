const subtopicRepository = require('../../infrastructure/repositories/sub-topic/sub-topic.repository');

class SubtopicService {
    async createSubtopic(payload) {
        return subtopicRepository.create(payload);
    }

    async getSubtopics(queryParams, projection = {}, options = {}) {
        const { page = 1, limit = 10, title, subject, topic, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (title) query.title = { $regex: title, $options: 'i' };
        if (subject) query.subject = subject;
        if (topic) query.topic = topic;

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const subtopics = await subtopicRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await subtopicRepository.count(query) || 0;

        return { total, page: parseInt(page), limit: parseInt(limit), subtopics };
    }

    async getSubtopicById(id) {
        return subtopicRepository.findById({ _id: id });
    }

    async updateSubtopic(id, payload) {
        return subtopicRepository.update({ _id: id }, payload);
    }

    async deleteSubtopic(id) {
        return subtopicRepository.delete({ _id: id });
    }
}

module.exports = new SubtopicService();
