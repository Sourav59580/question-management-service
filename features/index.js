const router = require("express").Router();

router.use('/', require('./otp-auth/otp-auth.routes'));
router.use('/users', require('./users/users.routes'));
router.use('/examination', require('./examination/examination.routes'));
router.use('/subject', require('./subject/subject.routes'))

module.exports = router;