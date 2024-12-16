const usersController = require("./users.controller");

const router = require("express").Router();

router.get("/", usersController.listAllUsers);
router.get("/:user_id", usersController.getUserById);
router.put("/:user_id", usersController.updateUser);
router.delete("/:user_id", usersController.deleteUser);
router.patch("/:user_id/set-new-password", usersController.setNewPassword);
router.patch("/:user_id/reset-password", usersController.resetUserPassword);
router.patch("/:user_id/forgot-password", usersController.forgotPassword);

module.exports = router;
