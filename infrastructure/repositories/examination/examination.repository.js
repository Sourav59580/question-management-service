const Examination = require("../../../domain/examination/examination.entity");
const BaseRepository = require("../base.repositories");

class ExaminationRepository extends BaseRepository {
    constructor() {
        super({ model: Examination });
    }
}

module.exports = new ExaminationRepository();