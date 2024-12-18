const router = require("express").Router();
const difficultyLevelController = require('./difficulty-level.controller');

router.post('/', difficultyLevelController.createDifficultyLevel);
router.get('/', difficultyLevelController.getDifficultyLevels);
router.get('/:id', difficultyLevelController.getDifficultyLevelById);
router.put('/:id', difficultyLevelController.updateDifficultyLevel);
router.delete('/:id', difficultyLevelController.deleteDifficultyLevel);

module.exports = router;