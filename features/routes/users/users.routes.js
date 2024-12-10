const { usersController } = require('../../controllers');

const router = require('express').Router();

router.post('/signup', usersController.createUser);

module.exports = router;
