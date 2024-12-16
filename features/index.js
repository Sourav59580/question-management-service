const router = require("express").Router();

router.use('/examination', require('./examination/examination.routes'));
router.use('/subject', require('./subject/subject.routes'));
router.use('/question', require('./question/question.routes'));

module.exports = router;