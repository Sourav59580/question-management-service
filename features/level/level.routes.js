const router = require("express").Router();
const levelController = require('./level.controller');

router.post('/', levelController.createLevel);
router.get('/', levelController.getLevels);
router.get('/:id', levelController.getLevelById);
router.put('/:id', levelController.updateLevel);
router.delete('/:id', levelController.deleteLevel);

module.exports = router;