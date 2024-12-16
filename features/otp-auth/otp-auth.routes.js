const router = require("express").Router();
const authenticationController = require("./otp-auth.controller");

router.post("/verify-otp", authenticationController.verifyOTP);
router.get("/:user_id/send-otp", authenticationController.sendOTP);

module.exports = router;
