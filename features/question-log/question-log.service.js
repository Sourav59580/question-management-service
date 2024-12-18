const questionLogRepository = require("../../infrastructure/repositories/question-log/question-log.repository");

class QuestionLogService {
  async createQuestionLog(payload) {
    return questionLogRepository.create(payload);
  }

  async getQuestionLogs(questionId) {
    return questionLogRepository
      .find({questionId})
      .populate("questionId user");
  }

}

module.exports = new QuestionLogService();
