const { userService } = require("./users.services");

class UserController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      if (!user) {
        return res.status(400).json("Invalid user data");
      }
      res.status(201).json(user);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }

  async loginUser(req, res) {
    try {
      const user = await userService.loginUser(req.body);
      if (!user) {
        return res.status(400).json("Invalid user data");
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }
}

module.exports = new UserController();