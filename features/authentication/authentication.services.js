const mongoose = require("mongoose");
const usersRepository = require("../../infrastructure/repositories/users/users.repository");
const verificationTokenRepository = require("../../infrastructure/repositories/verification-token/verification-token.repository");
const { generateOTP, sendOTP } = require("../../infrastructure/utils/send-otp");

class AuthenticationService {
  async loginUser(payload, res) {
    const { email = "", password = "" } = payload;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await usersRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    if (user.passwordUpdatedAt === null) {
      const verificationToken = await this.sendOTP(user._id);
      if (verificationToken) {
        return {
          message: "Please set new password",
          route: "/set-new-password",
        };
      }
    }

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    if (user.passwordUpdatedAt && user.passwordUpdatedAt <= twoMonthsAgo) {
      return {
        message: "Your password has been expired. Please set a new password",
        route: "/reset-password",
      };
    }

    const verificationToken = await this.sendOTP(user._id);
    if (verificationToken) {
      return {
        message: `OTP successfully sent to the registered mobile number ******${user.mobileNumber.slice(
          -4
        )}.`,
        route: "/verify-otp",
      };
    }
  }

  async logoutUser(req) {
    if (!req.session.user) {
      throw new Error("User not found");
    }
    req.session.destroy();
    return { message: "User logged out successfully" };
  }

  async sendOTP(userId, token = null) {
    const user = await usersRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const otp = token ? token : generateOTP();
    const message = await sendOTP({
      to: `91${user.mobileNumber}`,
      from: "QMS",
      otp: otp,
    });
    if (!message) {
      throw new Error("Failed to send OTP");
    }

    const verificationToken = await verificationTokenRepository.createToken({
      userId: user._id,
      otp: otp,
    });
    if (!verificationToken) {
      throw new Error("Failed to create verification token");
    }

    return verificationToken;
  }

  async verifyOTP(req) {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      throw new Error("User ID and OTP are required");
    }
    const verificationToken =
      await verificationTokenRepository.findTokenByUserID(userId);
    if (!verificationToken || verificationToken.otp !== otp) {
      return { message: "Invalid OTP" };
    }

    const user = await usersRepository.findUserById(userId);
    return (req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    });
  }
}

module.exports = new AuthenticationService();
