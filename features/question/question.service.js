const questionRepository = require('../../infrastructure/repositories/question/question.repository');

class QuestionService {
    async createQuestion(payload) {
        const QID = await questionRepository.getOrCreateQID();
        return questionRepository.create({
            ...payload,
            QID,
        });
    }

    async getFilteredQuestions(queryParams, projection, options) {
        const { page = 1, limit = 10, QID, subject, topic, subTopic, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (QID) query.QID = QID;
        if (subject) query.subject = subject;
        if (topic) query.topic = topic;
        if (subTopic) query.subTopic = subTopic;

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const questions = await questionRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await questionRepository.count(query);

        return { total, page: parseInt(page), limit: parseInt(limit), questions };
    }

    async getQuestionById(id) {
        return questionRepository.findById({ _id: id }, null, { populate: 'subject topic subTopic' });
    }

    async updateQuestion(id, payload) {
        return questionRepository.update({ _id: id }, payload);
    }

    async deleteQuestion(id) {
        return questionRepository.delete({ _id: id });
    }
}

module.exports = new QuestionService();
