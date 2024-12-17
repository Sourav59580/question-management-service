const levelService = require('../level/level.service');  

class LevelController {
    async createLevel(req, res) {
        try {
            const level = await levelService.createLevel(req.body);
            res.status(201).json(level);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLevels(req, res) {
        try {
            const levels = await levelService.getLevels(req.query);
            res.status(200).json(levels);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLevelById(req, res) {
        try {
            const level = await levelService.getLevelById(req.params.id);
            if (!level) return res.status(404).json({ message: 'Level not found' });
            res.status(200).json(level);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateLevel(req, res) {
        try {
            const updatedLevel = await levelService.updateLevel(req.params.id, req.body);
            if (!updatedLevel) return res.status(404).json({ message: 'Level not found' });
            res.status(200).json(updatedLevel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteLevel(req, res) {
        try {
            const deletedLevel = await levelService.deleteLevel(req.params.id);
            if (!deletedLevel) return res.status(404).json({ message: 'Level not found' });
            res.status(200).json({ message: 'Level deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new LevelController();
