const Tag = require("../../../domain/tag/tag.entity");
const BaseRepository = require("../base.repositories");

class TagRepository extends BaseRepository {
    constructor() {
        super({ model: Tag });
    }
}

module.exports = new TagRepository();