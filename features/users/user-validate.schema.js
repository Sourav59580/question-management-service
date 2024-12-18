const Joi = require("joi");
const USERROLES = require("../../domain/user/enums/user-role.enum");

exports.userSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  role: Joi.string().valid(...Object.values(USERROLES)).required(),
  assignedSubjects: Joi.array().items(Joi.string()).required(),
});

exports.userUpdateSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string().email(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/),
  rrole: Joi.string().valid(...Object.values(USERROLES)),
  assignedSubjects: Joi.array().items(Joi.string()),
});
