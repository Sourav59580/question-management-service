const router = require("express").Router();
const topicController = require('./topic.controller');

router.post('/', topicController.createTopic);
router.get('/', topicController.getTopics);
router.get('/:id', topicController.getTopicById);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);

module.exports = router;