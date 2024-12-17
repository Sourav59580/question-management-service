const router = require("express").Router();
const questionLogController = require('./question-log.controller');

router.post('/', questionLogController.createQuestionLog);
router.get('/', questionLogController.getQuestionLogs);
router.get('/:id', questionLogController.getQuestionLogById);
router.put('/:id', questionLogController.updateQuestionLog);
router.delete('/:id', questionLogController.deleteQuestionLog);

module.exports = router;