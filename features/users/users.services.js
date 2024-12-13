const mongoose = require("mongoose");
const { sendMail } = require("../../infrastructure/mailer/user-created-mail");
const {
  generatePassword,
} = require("../../infrastructure/utils/generate-password");
const usersRepository = require("../../infrastructure/repositories/users/users.repository");
const { sendOTP, generateOTP } = require("../../infrastructure/utils/send-otp");
const verificationTokenRepository = require("../../infrastructure/repositories/verification-token/verification-token.repository");

class UserService {
  async createUser(payload) {
    const {
      fullName = "",
      email = "",
      mobileNumber = "",
      role = "",
      subjects_id = [],
    } = payload;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!fullName || !email || !mobileNumber || !role || !subjects_id) {
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
      const isPasswordMatch = await user.comparePassword(
        userPayload.password,
        user.password
      );
      if (user && isPasswordMatch) {
        await sendMail(user.email, userPayload.password);
      }

      await session.commitTransaction();
      session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }

  async loginUser(payload) {
    const { email = "", password = "" } = payload;
    let otp = null;
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
      otp = generateOTP();
      if (isPasswordMatch && user.password_updated_at === null) {
        const message = await sendOTP({
          to: `91${user.mobileNumber}`,
          from: "QMS",
          otp: otp,
        });
        console.log(message);
        if (message) {
          const verficationToken = await verificationTokenRepository.create({
            user_id: user._id,
            otp: otp,
          });
          if (verficationToken) {
            return {
              message: "Please set new password",
              route: "/reset-password",
            };
          }
        }
      }
      // Check if password_updated_at is equal to or greater than 2 months from now
      if (user.password_updated_at) {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        if (user.password_updated_at <= twoMonthsAgo) {
          return {
            message:
              "Your password has been expired. Please set a new password",
            route: "/reset-password",
          };
        }
      }
      const message = await sendOTP({
        to: `918950523578`,
        from: "QMS",
      });
      console.log(message);
      if (message) {
        const verficationToken = await verificationTokenRepository.create({
          user_id: user._id,
          otp: otp,
        });
        if (verficationToken) {
          return {
            message: `OTP successfully sent to the registered mobile number ******${user.mobileNumber.slice(
              -4
            )}.`,
            route: "/verify-otp",
          };
        }
      }
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }
}

exports.userService = new UserService();
