const mongoose = require("mongoose");
const {
  sendMail,
} = require("../../../infrastructure/mailer/user-created-mail");
const {
  userRepositoryObj,
} = require("../../../infrastructure/repositories/users/users.repositories");
const {
  generatePassword,
} = require("../../../infrastructure/database/utils/generate-password");

exports.createUser = async (payload) => {
  const {
    full_name = "",
    email = "",
    mobile_number = "",
    role = "",
    subjects_id = [],
  } = payload;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!full_name || !email || !mobile_number || !role || !subjects_id) {
      throw new Error("All fields are required");
    }

    const userPayload = {
      full_name,
      email,
      mobile_number,
      role,
      subjects_id,
      password: generatePassword(),
    };

    const user = await userRepositoryObj.createUser(userPayload, { session });
    if (user) {
      await sendMail(user.email, user.password);
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
};

exports.loginUser = async (payload) => {
  const { email = "", password = "" } = payload;
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await userRepositoryObj.findUserByEmail(email);
    console.log('user: ', user);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.password !== password) {
      throw new Error("Invalid password");
    }
    if(user.password === password && user.password_updated_at === null){
      return { message: "Please set new password"}
    }
    // Check if password_updated_at is equal to or greater than 2 months from now
    if (user.password_updated_at) {
      const today = new Date();
      console.log('today: ', today.toISOString());
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      console.log('two months ago: ',twoMonthsAgo.toISOString());
      if (user.password_updated_at <= twoMonthsAgo) {
        return { message: "Please set a new password" };
      }
    }
    return user;
    
  } catch (error) {
    console.error("An error occurred: ", error);
    throw new Error("Internal server error");
  }

};
