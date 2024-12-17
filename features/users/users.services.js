const { sendMail } = require("../../infrastructure/mailer/user-created-mail");
const {
  generatePassword,
} = require("../../infrastructure/utils/generate-password");
const usersRepository = require("../../infrastructure/repositories/users/users.repository");
const authenticationServices = require("../authentication/authentication.services");
const { userSchema, userUpdateSchema } = require("./user-validate.schema");

class UserService {
  async createUser(payload) {
    const { error, value } = userSchema.validate(payload);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    const userPayload = {
      ...value,
      password: generatePassword(),
    };

    const user = await usersRepository.createUser(userPayload);
    if (!user) {
      throw new Error("Failed to create user");
    }

    const mail = await sendMail(user.email, userPayload.password);
    if (!mail) {
      throw new Error("Failed to send mail");
    }

    return user;
  }

  async listAllUsers(queryParams) {
    return usersRepository.findAllUsers();
  }

  async getUserById(user_id) {
    return usersRepository.findUserById(user_id);
  }

  async updateUser(user_id, payload) {
    const { error, value } = userUpdateSchema.validate(payload);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }
    if (!user_id) {
      throw new Error("User ID is required");
    }
    const user = await usersRepository.updateUser(user_id, value);
    
    return user;
  }

  async deleteUser(user_id) {
    return usersRepository.deleteUser({ _id: user_id });
  }

  async setNewPassword(user_id, payload) {
    const { password } = payload;
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
      passwordUpdatedAt: new Date(),
    });

    return updatedUser;
  }

  async resetUserPassword(user_id, payload) {
    const { oldPassword, password } = payload;
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
      passwordUpdatedAt: new Date(),
    });

    return updatedUser;
  }

  async forgotPassword(user_id) {
    if (!user_id) {
      throw new Error("User ID is required");
    }
    const verificationToken = await authenticationServices.sendOTP(user_id);
    return verificationToken;
  }
}

exports.userService = new UserService();
