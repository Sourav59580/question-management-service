const difficultyLevelService = require('./difficulty-level.service');

class DifficultyLevelController {
    async createDifficultyLevel(req, res) {
        try {
            const difficultyLevel = await difficultyLevelService.createDifficultyLevel(req.body);
            res.status(201).json(difficultyLevel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDifficultyLevels(req, res) {
        try {
            const difficultyLevels = await difficultyLevelService.getDifficultyLevels(req.query);
            res.status(200).json(difficultyLevels);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDifficultyLevelById(req, res) {
        try {
            const difficultyLevel = await difficultyLevelService.getDifficultyLevelById(req.params.id);
            if (!difficultyLevel) return res.status(404).json({ message: 'Difficulty Level not found' });
            res.status(200).json(difficultyLevel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateDifficultyLevel(req, res) {
        try {
            const updatedDifficultyLevel = await difficultyLevelService.updateDifficultyLevel(req.params.id, req.body);
            if (!updatedDifficultyLevel) return res.status(404).json({ message: 'Difficulty Level not found' });
            res.status(200).json(updatedDifficultyLevel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteDifficultyLevel(req, res) {
        try {
            const deletedDifficultyLevel = await difficultyLevelService.deleteDifficultyLevel(req.params.id);
            if (!deletedDifficultyLevel) return res.status(404).json({ message: 'Difficulty Level not found' });
            res.status(200).json({ message: 'Difficulty Level deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DifficultyLevelController();
