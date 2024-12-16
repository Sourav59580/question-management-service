const router = require("express").Router();
const authenticationController = require("./authentication.controller");

router.post("/register", authenticationController.createUser);
router.post("/login", authenticationController.loginUser);
router.post("/verify-otp", authenticationController.verifyOTP);
router.get("/:user_id/send-otp", authenticationController.sendOTP);

module.exports = router;
