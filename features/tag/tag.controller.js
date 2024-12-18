const tagService = require('./tag.service');

class TagController {
    async createTag(req, res) {
        try {
            const tag = await tagService.createTag(req.body);
            res.status(201).json(tag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTags(req, res) {
        try {
            const tags = await tagService.getTags(req.query);
            res.status(200).json(tags);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTagById(req, res) {
        try {
            const tag = await tagService.getTagById(req.params.id);
            if (!tag) return res.status(404).json({ message: 'Tag not found' });
            res.status(200).json(tag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateTag(req, res) {
        try {
            const updatedTag = await tagService.updateTag(req.params.id, req.body);
            if (!updatedTag) return res.status(404).json({ message: 'Tag not found' });
            res.status(200).json(updatedTag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteTag(req, res) {
        try {
            const deletedTag = await tagService.deleteTag(req.params.id);
            if (!deletedTag) return res.status(404).json({ message: 'Tag not found' });
            res.status(200).json({ message: 'Tag deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TagController();
