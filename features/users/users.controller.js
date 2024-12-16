const { userService } = require("./users.services");

class UserController {
  async listAllUsers(req, res) {
    try {
      const users = await userService.listAllUsers();
      if (!users) {
        return res.status(400).json("No users found");
      }
      res.status(200).json(users);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.user_id);
      if (!user) {
        return res.status(400).json("User not found");
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.user_id, req.body);
      if (!user) {
        return res.status(400).json("User not found");
      }
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await userService.deleteUser(req.params.user_id);
      if (!user) {
        return res.status(400).json("Unable to delete user.");
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }

  async setNewPassword(req, res) {
    try {
      const user = await userService.setNewPassword(
        req.params.user_id,
        req.body
      );
      if (!user) {
        return res.status(400).json("User not found");
      }
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }

  async resetUserPassword(req, res) {
    try {
      const user = await userService.resetUserPassword(
        req.params.user_id,
        req.body
      );
      if (!user) {
        return res.status(400).json("User not found");
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }

  async forgotPassword(req, res) {
    try {
      const user = await userService.forgotPassword(req.params.user_id);
      if (!user) {
        return res.status(400).json("User not found");
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json("Internal server error");
    }
  }
}

module.exports = new UserController();
