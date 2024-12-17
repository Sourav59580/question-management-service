const jwt = require("jsonwebtoken");

class AuthMiddleware {
  verifyUserRole(allowedRoles = []) {
    return async (req, res, next) => {
      try {
        if (!req.session || !req.session.user) {
          return res
            .status(401)
            .json({ message: "Unauthorized. Please log in." });
        }
        if (req.session.user.role !== "master_user") {
          return res
            .status(403)
            .json({ message: "Access denied. Only master users are allowed." });
        }
        next();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
  }
}

module.exports = new AuthMiddleware();
