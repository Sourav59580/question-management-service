const router = require('express').Router();

router.use('/', require('./users/users.routes'));


router.get('/', (req, res) => {
  res.json({ status: 'This is the Question Management Microservice 1.0.0' });
});

module.exports = router;
