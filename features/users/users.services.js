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
    const { page = 1, limit = 10, fullName, email, mobileNumber, role, sortBy = "createdAt", sortOrder = "asc", ...filters } = queryParams;

    const query = { ...filters };
    if (fullName) query.fullName = { $regex: fullName, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (mobileNumber)
      query.mobileNumber = { $regex: mobileNumber, $options: "i" };
    if (role) query.role = role;

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    const projection = { __v: 0, password: 0 };
    const users = await usersRepository.find(query, projection, {
      skip,
      limit: parseInt(limit),
      sort: sortOptions,
      populate: "assignedSubjects",
      lean: true,
    });
    const total = await usersRepository.count();

    return { total, count: users.length, page: parseInt(page), limit: parseInt(limit), users };
  }

  async getUserById(userId) {
    return usersRepository.findUserById(userId);
  }

  async updateUser(userId, payload) {
    const { error, value } = userUpdateSchema.validate(payload);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }
    if (!userId) {
      throw new Error("User ID is required");
    }
    const user = await usersRepository.updateUser(userId, value);
    return user;
  }

  async deleteUser(userId) {
    return usersRepository.deleteUser({ _id: userId });
  }

  async setNewPassword(userId, payload) {
    const { password } = payload;
    if (!userId || !password) {
      throw new Error("User ID and password are required");
    }
    const user = await usersRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const encryptedPassword = await user.encryptPassword(password);

    const updatedUser = await usersRepository.updateUser(userId, {
      password: encryptedPassword,
      passwordUpdatedAt: new Date(),
    });

    return updatedUser;
  }

  async resetUserPassword(userId, payload) {
    const { oldPassword, password } = payload;
    if (!userId || !password || !oldPassword) {
      throw new Error("User ID and password are required");
    }
    const user = await usersRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return { message: "Invalid old password" };
    }

    const encryptedPassword = await user.encryptPassword(password);

    const updatedUser = await usersRepository.updateUser(userId, {
      password: encryptedPassword,
      passwordUpdatedAt: new Date(),
    });

    return updatedUser;
  }

  async forgotPassword(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const verificationToken = await authenticationServices.sendOTP(userId);
    return verificationToken;
  }
}

exports.userService = new UserService();
