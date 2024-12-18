const router = require("express").Router();
const authenticationController = require("./authentication.controller");

router.post("/login", authenticationController.loginUser);
router.post("/verify-otp", authenticationController.verifyOTP);
router.get("/:userId/send-otp", authenticationController.sendOTP);

module.exports = router;
