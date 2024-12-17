const jwt = require("jsonwebtoken");

class AuthMiddleware {
  verifyUserRole(allowedRoles = []) {
    return async (req, res, next) => {
      try {
          const token = req.headers.authorization;
          console.log("headers", req.token);
          const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded", user);
        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
          return res.status(400).json({ message: "Unauthorized" });
        }
        next();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
  }
}

module.exports = new AuthMiddleware();
