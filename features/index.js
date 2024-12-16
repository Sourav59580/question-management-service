const router = require("express").Router();

router.use("/", require("./authentication/authentication.routes"));
router.use("/users", require("./users/users.routes"));
router.use("/examination", require("./examination/examination.routes"));
router.use("/subject", require("./subject/subject.routes"));

module.exports = router;
