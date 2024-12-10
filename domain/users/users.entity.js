const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const USERROLES = require("./enums/user-roles.enums");

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    mobile_number: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (mobileNumber) {
            return /\d{10}/.test(mobileNumber);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      ],
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(USERROLES),
    },
    subjects_id: {
      type: [String],
      required: true,
      validate: {
        validator: function (subjects) {
          return subjects.every(subject => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(subject));
        },
        message: (props) => `${props.value} contains an invalid UUID!`,
      },
    },
    password: {
      type: String,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;