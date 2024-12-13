const router = require("express").Router();

router.use('/examination', require('./examination/examination.routes'));
router.use('/subject', require('./subject/subject.routes'))
router.use('/users', require('./users/users.routes'));
router.use('/auth', require('./authentication/authentication.routes'));

module.exports = router;