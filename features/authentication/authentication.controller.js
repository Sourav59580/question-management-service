const authenticationServices = require("./authentication.services");

class AuthenticationController {
  async loginUser(req, res) {
    try {
      const user = await authenticationServices.loginUser(req.body);
      if (!user) {
        return res.status(400).json("Invalid user data");
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async logoutUser(req, res) {
    try {
      const user = await authenticationServices.logoutUser(req);
      if (!user) {
        return res.status(400).json("Invalid user data");
      }
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error("Error in user controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async sendOTP(req, res) {
    const { userId } = req.params;
    try {
      const otp = await authenticationServices.sendOTP(userId);
      if (!otp) {
        return res.status(400).json("OTP not sent");
      }
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error in authentication controller", error);
      res.status(500).json({ error: error.message });
    }
  }

  async verifyOTP(req, res) {
    try {
      const token = await authenticationServices.verifyOTP(req);
      if (!token) {
        return res.status(400).json("Invalid OTP");
      }
      res.status(200).json({ message: "OTP verified successfully"});
    } catch (error) {
      console.error("Error in authentication controller", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthenticationController();