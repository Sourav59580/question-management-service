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
            await QuestionService.createQuestion(req.body);
            res.status(201).json({ message: 'Question created successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async bulkUploadQuestions(req, res) {
        try {
            const questions = req.body;

            if (!Array.isArray(questions) || questions.length === 0) {
                return res.status(400).json({ message: 'Invalid or empty question data.' });
            }

            const { successCount, errorCount, errors } = await QuestionService.bulkUploadQuestions(questions);

            res.status(200).json({
                message: 'Bulk upload completed.',
                successCount,
                errorCount,
                errors,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
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

    static async addOrUpdateReview(req, res) {
        try {
            const { id } = req.params;
            const { user, comment, status } = req.body;
            const updatedQuestion = await QuestionService.addOrUpdateReview(id, { user, comment, status });

            res.status(200).json({
                message: 'Review added/updated successfully.',
                question: updatedQuestion,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
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

    static async getQuestionLogs(req, res) {
        try {
            const { id } = req.params;
            const logs = await QuestionService.getQuestionLogs(id);

            if (!logs || logs.length === 0) {
                return res.status(404).json({ message: 'No logs found for the given question.' });
            }

            res.status(200).json({ logs });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = QuestionController;
