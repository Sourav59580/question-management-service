const questionLogRepository = require("../../infrastructure/repositories/question-log/question-log.repository");

class QuestionLogService {
  async createQuestionLog(payload) {
    return questionLogRepository.create(payload);
  }

  async getQuestionLogs(queryParams, projection = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      action,
      sortBy = "createdAt",
      sortOrder = "asc",
      ...filters
    } = queryParams;

    const query = { ...filters };
    if (action) query.action = action;

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const questionLogs = await questionLogRepository
      .find(query, projection, {
        ...options,
        skip,
        limit: parseInt(limit),
        sort: sortOptions,
      })
      .populate("questionId user");

    const total = (await questionLogRepository.count(query)) || 0;

    return {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      questionLogs,
    };
  }

  async getQuestionLogById(id) {
    return questionLogRepository
      .findById({ _id: id })
      .populate("questionId user");
  }

  async updateQuestionLog(id, payload) {
    return questionLogRepository.update({ _id: id }, payload);
  }

  async deleteQuestionLog(id) {
    return questionLogRepository.delete({ _id: id });
  }
}

module.exports = new QuestionLogService();