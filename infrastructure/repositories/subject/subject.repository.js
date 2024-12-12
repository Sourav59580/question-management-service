const Subject = require("../../../domain/subject/subject.entity");
const BaseRepository = require("../base.repositories");

class SubjectRepository extends BaseRepository {
    constructor() {
        super({ model: Subject });
    }
}

module.exports = new SubjectRepository();