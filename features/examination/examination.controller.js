const examinationService = require('./examination.service');

class ExaminationController {
    async createExamination(req, res) {
        try {
            const examination = await examinationService.createExamination(req.body);
            res.status(201).json(examination);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getExaminations(req, res) {
        try {
            const examinations = await examinationService.getExaminations(req.query);
            res.status(200).json(examinations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getExaminationById(req, res) {
        try {
            const examination = await examinationService.getExaminationById(req.params.id);
            if (!examination) return res.status(404).json({ message: 'Examination not found' });
            res.status(200).json(examination);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateExamination(req, res) {
        try {
            const updatedExamination = await examinationService.updateExamination(req.params.id, req.body);
            if (!updatedExamination) return res.status(404).json({ message: 'Examination not found' });
            res.status(200).json(updatedExamination);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteExamination(req, res) {
        try {
            const deletedExamination = await examinationService.deleteExamination(req.params.id);
            if (!deletedExamination) return res.status(404).json({ message: 'Examination not found' });
            res.status(200).json({ message: 'Examination deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ExaminationController();