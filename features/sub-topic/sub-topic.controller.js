const subtopicService = require('./sub-topic.service');

class SubtopicController {
    async createSubtopic(req, res) {
        try {
            const subtopic = await subtopicService.createSubtopic(req.body);
            res.status(201).json(subtopic);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSubtopics(req, res) {
        try {
            const subtopics = await subtopicService.getSubtopics(req.query);
            res.status(200).json(subtopics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSubtopicById(req, res) {
        try {
            const subtopic = await subtopicService.getSubtopicById(req.params.id);
            if (!subtopic) return res.status(404).json({ message: 'Subtopic not found' });
            res.status(200).json(subtopic);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateSubtopic(req, res) {
        try {
            const updatedSubtopic = await subtopicService.updateSubtopic(req.params.id, req.body);
            if (!updatedSubtopic) return res.status(404).json({ message: 'Subtopic not found' });
            res.status(200).json(updatedSubtopic);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteSubtopic(req, res) {
        try {
            const deletedSubtopic = await subtopicService.deleteSubtopic(req.params.id);
            if (!deletedSubtopic) return res.status(404).json({ message: 'Subtopic not found' });
            res.status(200).json({ message: 'Subtopic deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SubtopicController();
