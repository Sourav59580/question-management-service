const Topic = require("../../../domain/topic/topic.entity");
const BaseRepository = require("../base.repositories");

class TopicRepository extends BaseRepository {
    constructor() {
        super({ model: Topic });
    }
}

module.exports = new TopicRepository();