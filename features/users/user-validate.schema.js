const Joi = require("joi");

exports.userUpdateSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  role: Joi.string().required(),
  assignedSubjects: Joi.array().items(Joi.string()).required(),
});
