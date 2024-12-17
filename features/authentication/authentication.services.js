const mongoose = require("mongoose");
const usersRepository = require("../../infrastructure/repositories/users/users.repository");
const verificationTokenRepository = require("../../infrastructure/repositories/verification-token/verification-token.repository");
const { generateOTP, sendOTP } = require("../../infrastructure/utils/send-otp");
const {
  generatePassword,
} = require("../../infrastructure/utils/generate-password");
const { sendMail } = require("../../infrastructure/mailer/user-created-mail");

class AuthenticationService {
  async loginUser(payload) {
    const { email = "", password = "" } = payload;
    try {
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
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }

  async sendOTP(userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await usersRepository.findUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const otp = generateOTP();
      const message = await sendOTP({
        to: `91${user.mobileNumber}`,
        from: "QMS",
        otp: otp,
      });
      if (!message) {
        throw new Error("Failed to send OTP");
      }

      const verificationToken = await verificationTokenRepository.createToken(
        {
          user_id: user._id,
          otp: otp,
        },
        { session }
      );
      if (!verificationToken) {
        throw new Error("Failed to create verification token");
      }

      await session.commitTransaction();
      return verificationToken;
    } catch (error) {
      await session.abortTransaction();
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    } finally {
      session.endSession();
    }
  }

  async verifyOTP({ userId, otp }) {
    try {
      if (!userId || !otp) {
        throw new Error("User ID and OTP are required");
      }
      const verificationToken =
        await verificationTokenRepository.findTokenByUserID(userId);
      if (!verificationToken || verificationToken.otp !== otp) {
        return { message: "Invalid OTP" };
      }
      return verificationToken;
    } catch (error) {
      console.error("Error in verifying OTP", error);
      throw new Error("Invalid OTP");
    }
  }
}

module.exports = new AuthenticationService();
