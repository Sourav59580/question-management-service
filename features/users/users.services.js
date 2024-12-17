const mongoose = require("mongoose");
const { sendMail } = require("../../infrastructure/mailer/user-created-mail");
const {
  generatePassword,
} = require("../../infrastructure/utils/generate-password");
const usersRepository = require("../../infrastructure/repositories/users/users.repository");
const authenticationServices = require("../authentication/authentication.services");
const { userUpdateSchema } = require("./user-validate.schema");

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
      if (
        !fullName ||
        !email ||
        !mobileNumber ||
        !role ||
        !subjects_id.length
      ) {
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
        const verificationToken = await authenticationServices.sendOTP(
          user._id
        );
        if (verificationToken) {
          return {
            message: "Please set new password",
            route: "/reset-password",
          };
        }
      }

      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      if (
        user.password_updated_at &&
        user.password_updated_at <= twoMonthsAgo
      ) {
        return {
          message: "Your password has been expired. Please set a new password",
          route: "/reset-password",
        };
      }

      const verificationToken = await authenticationServices.sendOTP(user._id);
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

  async listAllUsers() {
    try {
      const users = await usersRepository.findAllUsers();
      console.log("users", users);
      if (!users) {
        throw new Error("No users found");
      }
      return users;
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }

  async getUserById(user_id) {
    try {
      if (!user_id) {
        throw new Error("User ID is required");
      }
      const user = await usersRepository.findUserById(user_id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }

  async updateUser(user_id, payload) {
    const { error, value } = userUpdateSchema.validate(payload);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }
    try {
      if (!user_id) {
        throw new Error("User ID is required");
      }
      const user = await usersRepository.updateUser(user_id, value);
      console.log("user", user);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }

  async deleteUser(user_id) {
    console.log("user_id", user_id);
    try {
      if (!user_id) {
        throw new Error("User ID is required");
      }
      const user = await usersRepository.deleteUser({
        _id: user_id,
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user.deletedCount;
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }

  async setNewPassword(user_id, payload) {
    const { password } = payload;
    try {
      if (!user_id || !password) {
        throw new Error("User ID and password are required");
      }
      const user = await usersRepository.findUserById(user_id);
      if (!user) {
        throw new Error("User not found");
      }

      const encryptedPassword = await user.encryptPassword(password);

      const updatedUser = await usersRepository.updateUser(user_id, {
        password: encryptedPassword,
        password_updated_at: new Date(),
      });
      if (!updatedUser) {
        throw new Error("Failed to update password");
      }

      return updatedUser;
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }

  async resetUserPassword(user_id, payload) {
    const { oldPassword, password } = payload;
    try {
      if (!user_id || !password || !oldPassword) {
        throw new Error("User ID and password are required");
      }
      const user = await usersRepository.findUserById(user_id);
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordMatch = await user.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return { message: "Invalid old password" };
      }

      const encryptedPassword = await user.encryptPassword(password);

      const updatedUser = await usersRepository.updateUser(user_id, {
        password: encryptedPassword,
        password_updated_at: new Date(),
      });
      if (!updatedUser) {
        throw new Error("Failed to update password");
      }

      return { message: "Password updated successfully" };
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }

  async forgotPassword(user_id) {
    try {
      if (!user_id) {
        throw new Error("User ID is required");
      }
      const verificationToken = await authenticationServices.sendOTP(user_id);
      if (!verificationToken) {
        throw new Error("Failed to send OTP");
      }
      return {
        message: "OTP successfully sent to the registered mobile number.",
        route: "/set-new-password",
      };
    } catch (error) {
      console.error("An error occurred: ", error);
      throw new Error("Internal server error");
    }
  }
}

exports.userService = new UserService();
