const subjectService = require('./subject.service');

class SubjectController {
    async createSubject(req, res) {
        try {
            const subject = await subjectService.createSubject(req.body);
            res.status(201).json(subject);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSubjects(req, res) {
        try {
            const subjects = await subjectService.getSubjects(req.query);
            res.status(200).json(subjects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSubjectById(req, res) {
        try {
            const subject = await subjectService.getSubjectById(req.params.id);
            if (!subject) return res.status(404).json({ message: 'Subject not found' });
            res.status(200).json(subject);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateSubject(req, res) {
        try {
            const updatedSubject = await subjectService.updateSubject(req.params.id, req.body);
            if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
            res.status(200).json(updatedSubject);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteSubject(req, res) {
        try {
            const deletedSubject = await subjectService.deleteSubject(req.params.id);
            if (!deletedSubject) return res.status(404).json({ message: 'Subject not found' });
            res.status(200).json({ message: 'Subject deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SubjectController();