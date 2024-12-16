const QuestionService = require('./question.service');

class QuestionController {
    static async getFilteredQuestions(req, res) {
        try {
            const { QID, subject, topic, subTopic } = req.query;
            const filters = { QID, subject, topic, subTopic };
            const questions = await QuestionService.getFilteredQuestions(filters);
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getQuestionById(req, res) {
        try {
            const question = await QuestionService.getQuestionById(req.params.id);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.status(200).json(question);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createQuestion(req, res) {
        try {
            const question = await QuestionService.createQuestion(req.body);
            res.status(201).json(question);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateQuestion(req, res) {
        try {
            const question = await QuestionService.updateQuestion(req.params.id, req.body);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.status(200).json(question);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteQuestion(req, res) {
        try {
            const success = await QuestionService.deleteQuestion(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.status(200).json({ message: 'Question deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = QuestionController;
