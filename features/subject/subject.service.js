const subjectRepository = require('../../infrastructure/repositories/subject/subject.repository')

class SubjectService {
    async createSubject(payload) {
        return subjectRepository.create(payload);
    }

    async getSubjects(queryParams, projection, options) {
        const { page = 1, limit = 10, name, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = queryParams;

        const query = { ...filters };
        if (name) query.title = { $regex: name, $options: 'i' };

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const subjects = await subjectRepository.find(query, projection, { ...options, skip, limit: parseInt(limit), sort: sortOptions });
        const total = await subjectRepository.count(query);

        return { total, page: parseInt(page), limit: parseInt(limit), subjects };
    }

    async getSubjectById(id) {
        return subjectRepository.findById({ _id: id }, null, { populate: 'createdBy' });
    }

    async updateSubject(id, payload) {
        return subjectRepository.update({ _id: id }, payload);
    }

    async deleteSubject(id) {
        return subjectRepository.delete({ _id: id });
    }
}

module.exports = new SubjectService();