const questionLogService = require('./question-log.service');

class QuestionLogController {
    async createQuestionLog(req, res) {
        try {
            const questionLog = await questionLogService.createQuestionLog(req.body);
            res.status(201).json(questionLog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getQuestionLogs(req, res) {
        try {
            const questionLogs = await questionLogService.getQuestionLogs(req.query);
            res.status(200).json(questionLogs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getQuestionLogById(req, res) {
        try {
            const questionLog = await questionLogService.getQuestionLogById(req.params.id);
            if (!questionLog) return res.status(404).json({ message: 'Question Log not found' });
            res.status(200).json(questionLog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateQuestionLog(req, res) {
        try {
            const updatedQuestionLog = await questionLogService.updateQuestionLog(req.params.id, req.body);
            if (!updatedQuestionLog) return res.status(404).json({ message: 'Question Log not found' });
            res.status(200).json(updatedQuestionLog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteQuestionLog(req, res) {
        try {
            const deletedQuestionLog = await questionLogService.deleteQuestionLog(req.params.id);
            if (!deletedQuestionLog) return res.status(404).json({ message: 'Question Log not found' });
            res.status(200).json({ message: 'Question Log deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new QuestionLogController();
