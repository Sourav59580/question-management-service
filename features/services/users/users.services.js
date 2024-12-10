const { userRepositoryObj } = require("../../../infrastructure/repositories/users/users.repositories");

exports.createUser = async (payload) => {
  const {
    full_name = "",
    email = "",
    mobile_number = "",
    role = "",
    subjects_id = [],
  } = payload;
  try {
    if (!full_name || !email || !mobile_number || !role || !subjects_id.length) {
      throw new Error("All fields are required");
    }
    const user = await userRepositoryObj.createUser(payload);
    return user;
  } catch (error) {
    console.error("An error occurred: ", error);
    throw new Error("Internal server error");
  }
};
