const DifficultyLevel = require("../../../domain/difficulty-level/difficulty-level.entity");
const BaseRepository = require("../base.repositories");

class DifficultyLevelRepository extends BaseRepository {
    constructor() {
        super({ model: DifficultyLevel });
    }
}

module.exports = new DifficultyLevelRepository();