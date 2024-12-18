const SubTopic = require("../../../domain/sub-topic/sub-topic.entity");
const BaseRepository = require("../base.repositories");

class SubTopicRepository extends BaseRepository {
    constructor() {
        super({ model: SubTopic });
    }
}

module.exports = new SubTopicRepository();