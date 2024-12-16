const Question = require("../../../domain/question/question-entity");
const BaseRepository = require("../base.repositories");

class QuestionRepository extends BaseRepository {
    constructor() {
        super({ model: Question });
    }
    
    async getOrCreateQID() {
        const lastQID = await this.model.findOne().sort({ QID: -1 }).limit(1);
        return lastQID
            ? (parseInt(lastQID.QID) + 1).toString().padStart(15, '0')
            : '000000000000001';
    }
}

module.exports = new QuestionRepository();