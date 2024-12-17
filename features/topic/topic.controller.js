const topicService = require('./topic.service');

class TopicController {
    async createTopic(req, res) {
        try {
            const topic = await topicService.createTopic(req.body);
            res.status(201).json(topic);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTopics(req, res) {
        try {
            const topics = await topicService.getTopics(req.query);
            res.status(200).json(topics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTopicById(req, res) {
        try {
            const topic = await topicService.getTopicById(req.params.id);
            if (!topic) return res.status(404).json({ message: 'Topic not found' });
            res.status(200).json(topic);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateTopic(req, res) {
        try {
            const updatedTopic = await topicService.updateTopic(req.params.id, req.body);
            if (!updatedTopic) return res.status(404).json({ message: 'Topic not found' });
            res.status(200).json(updatedTopic);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteTopic(req, res) {
        try {
            const deletedTopic = await topicService.deleteTopic(req.params.id);
            if (!deletedTopic) return res.status(404).json({ message: 'Topic not found' });
            res.status(200).json({ message: 'Topic deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TopicController();
