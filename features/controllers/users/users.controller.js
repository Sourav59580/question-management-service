const { usersService } = require("../../services");

/**
 * Controller function to initialize a follow-up.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
exports.createUser = async (req, res) => {
  try {
    const user = await usersService.createUser(req.body);
    if (!user) {
      return res.status(400).json("Invalid user data");
    }
    res.status(201).json(user);
  } catch (error) {
    console.error("Error in user controller", error);
    res.status(500).json("Internal server error");
  }
};
