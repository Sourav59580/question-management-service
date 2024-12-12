const examinationRepository = require('../../infrastructure/repositories/examination/examination.repository')

class ExaminationService {
    async createExamination(payload) {
        return examinationRepository.create(payload);
    }

    async getExaminations(queryParams, projection, options) {
        const { page = 1, limit = 10, name, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (name) query.title = { $regex: name, $options: 'i' };

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const examinations = await examinationRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await examinationRepository.count(query) || 0;

        return { total, page: parseInt(page), limit: parseInt(limit), examinations };
    }

    async getExaminationById(id) {
        return examinationRepository.findById({ _id: id });
    }

    async updateExamination(id, payload) {
        return examinationRepository.update({ _id: id }, payload);
    }

    async deleteExamination(id) {
        return examinationRepository.delete({ _id: id });
    }
}

module.exports = new ExaminationService();