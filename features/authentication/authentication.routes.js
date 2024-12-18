const router = require("express").Router();
const authenticationController = require("./authentication.controller");

router.post("/login", authenticationController.loginUser);
router.get("/logout", authenticationController.logoutUser);
router.post("/verify-otp", authenticationController.verifyOTP);
router.get("/:userId/send-otp", authenticationController.sendOTP);

module.exports = router;
