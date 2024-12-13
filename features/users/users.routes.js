const usersController = require("./users.controller");

const router = require("express").Router();

router.post("/register", usersController.createUser);
router.post("/login", usersController.loginUser);

module.exports = router;
