const router = require("express").Router();
const subTopicController = require('./sub-topic.controller');

router.post('/', subTopicController.createSubtopic);
router.get('/', subTopicController.getSubtopics);
router.get('/:id', subTopicController.getSubtopicById);
router.put('/:id', subTopicController.updateSubtopic);
router.delete('/:id', subTopicController.deleteSubtopic);

module.exports = router;