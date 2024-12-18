const Level = require("../../../domain/level/level.entity");
const BaseRepository = require("../base.repositories");

class LevelRepository extends BaseRepository {
    constructor() {
        super({ model: Level });
    }
}

module.exports = new LevelRepository();