const USERROLES = require("../../domain/user/enums/user-role.enum");
const authenticationMiddleware = require("../authentication/authentication.middleware");
const usersController = require("./users.controller");

const router = require("express").Router();

router.post(
  "/register",
  authenticationMiddleware.verifyUserRole([USERROLES.MASTER_USER]),
  usersController.createUser
);
router.get("/", usersController.listAllUsers);
router.get("/:userId", usersController.getUserById);
router.put(
  "/:userId",
  authenticationMiddleware.verifyUserRole([USERROLES.MASTER_USER]),
  usersController.updateUser
);
router.delete(
  "/:userId",
  authenticationMiddleware.verifyUserRole([USERROLES.MASTER_USER]),
  usersController.deleteUser
);
router.patch("/:userId/set-new-password", usersController.setNewPassword);
router.patch("/:userId/reset-password", usersController.resetUserPassword);
router.patch("/:userId/forgot-password", usersController.forgotPassword);

module.exports = router;
