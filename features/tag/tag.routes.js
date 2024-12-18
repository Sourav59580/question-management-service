const router = require("express").Router();
const tagController = require('./tag.controller');

router.post('/', tagController.createTag);
router.get('/', tagController.getTags);
router.get('/:id', tagController.getTagById);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;