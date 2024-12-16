const questionRepository = require('../../infrastructure/repositories/question/question.repository');
const questionLogRepository = require('../../infrastructure/repositories/question-log/qustion-log')
class QuestionService {
    async createQuestion(payload) {
        const QID = await questionRepository.getOrCreateQID();
        const createdQuestion = await questionRepository.create({
            ...payload,
            QID,
        });

        await questionLogRepository.create({
            questionId: createdQuestion._id,
            action: 'created',
            details: `Question created with QID: ${createdQuestion.QID}`,
            user: payload.createdBy,
        });

        return createdQuestion;
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
        const updatedQuestion = questionRepository.update({ _id: id }, payload);

        await questionLogRepository.create({
            questionId: id,
            action: 'updated',
            details: `Question updated with payload: ${JSON.stringify(payload)}`,
            user: payload.updatedBy,
        });

        return updatedQuestion;
    }

    async deleteQuestion(id) {
        const deletedQuestion = questionRepository.delete({ _id: id });

        await questionLogRepository.create({
            questionId: id,
            action: 'deleted',
            details: `Question with ID ${id} was deleted.`,
            user: deletedBy,
        });

        return deletedQuestion;
    }
}

module.exports = new QuestionService();
