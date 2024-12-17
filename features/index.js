const router = require("express").Router();

router.use('/difficulty-level', require('./difficulty-level/difficulty-level.routes'))
router.use('/examination', require('./examination/examination.routes'));
router.use('/level', require('./level/level.routes'))
router.use('/question', require('./question/question.routes'));
router.use('/question-log', require('./question-log/question-log.routes'))
router.use('/sub-topic', require('./sub-topic/sub-topic.routes'))
router.use('/subject', require('./subject/subject.routes'));
router.use('/tag', require('./tag/tag.routes'))
router.use('/topic', require('./topic/topic.routes'))

module.exports = router;