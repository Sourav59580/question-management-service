const mongoose = require("mongoose");
const usersRepository = require("../../infrastructure/repositories/users/users.repository");
const verificationTokenRepository = require("../../infrastructure/repositories/verification-token/verification-token.repository");
const { generateOTP, sendOTP } = require("../../infrastructure/utils/send-otp");

class AuthenticationService {
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
