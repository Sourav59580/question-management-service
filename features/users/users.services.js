const mongoose = require("mongoose");
const { sendMail } = require("../../infrastructure/mailer/user-created-mail");
const {
  generatePassword,
} = require("../../infrastructure/utils/generate-password");
const usersRepository = require("../../infrastructure/repositories/users/users.repository");
const authenticationServices = require("../otp-auth/otp-auth.services");

class UserService {
  async createUser(payload) {
    const { fullName = "", email = "", mobileNumber = "", role = "", subjects_id = [] } = payload;
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      if (!fullName || !email || !mobileNumber || !role || !subjects_id.length) {
        throw new Error("All fields are required");
      }
  
      const userPayload = {
        fullName,
        email,
        mobileNumber,
        role,
        subjects_id,
        password: generatePassword(),
      };
  
      const user = await usersRepository.createUser(userPayload, { session });
      if (!user) {
        throw new Error("Failed to create user");
      }
  
      await sendMail(user.email, userPayload.password);
  
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    } finally {
      session.endSession();
    }
  }

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
  
      if (user.password_updated_at === null) {
        const verificationToken = await authenticationServices.sendOTP(user._id);
        if (verificationToken) {
          return {
            message: "Please set new password",
            route: "/reset-password",
          };
        }
      }
  
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      if (user.password_updated_at && user.password_updated_at <= twoMonthsAgo) {
        return {
          message: "Your password has been expired. Please set a new password",
          route: "/reset-password",
        };
      }
  
      const verificationToken = await authenticationServices.sendOTP(user._id);
      if (verificationToken) {
        return {
          message: `OTP successfully sent to the registered mobile number ******${user.mobileNumber.slice(-4)}.`,
          route: "/verify-otp",
        };
      }
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }
}

exports.userService = new UserService();
