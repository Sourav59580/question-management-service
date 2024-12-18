const QuestionLog = require("../../../domain/question-log/question-log.entity");
const BaseRepository = require("../base.repositories");

class QuestionLogRepository extends BaseRepository {
    constructor() {
        super({ model: QuestionLog });
    }
}

module.exports = new QuestionLogRepository();