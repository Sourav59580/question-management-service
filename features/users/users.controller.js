const { userService } = require("./users.services");

class UserController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async listAllUsers(req, res) {
    try {
      const users = await userService.listAllUsers(req.query);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.userId);
      if (!user) return res.status(400).json("User not found");
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.userId, req.body);
      if (!user) return res.status(400).json("User not found");
      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await userService.deleteUser(req.params.userId);
      if (!user) return res.status(400).json("User not found");
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async setNewPassword(req, res) {
    try {
      const user = await userService.setNewPassword(
        req.params.userId,
        req.body
      );
      if (!user) throw new Error("Failed to update password");
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async resetUserPassword(req, res) {
    try {
      const user = await userService.resetUserPassword(
        req.params.userId,
        req.body
      );
      if (!user) throw new Error("Failed to update password");
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const verificationToken = await userService.forgotPassword(
        req.params.userId
      );
      if (!verificationToken) {
        return res.status(400).json({ message: "Failed to send OTP" });
      }
      return res.status(200).json({
        message: "OTP successfully sent to the registered mobile number.",
        route: "/set-new-password",
      });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
