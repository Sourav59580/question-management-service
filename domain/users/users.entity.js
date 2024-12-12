const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const USERROLES = require("./enums/user-roles.enums");
const Schema = mongoose.Schema;

const userSchema = new Schema(
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
      type: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
      required: true,
    },
    password: {
      type: String,
    },
    password_updated_at: {
      type: Date,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.password_updated_at;
        delete ret.deleted_at;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.password_updated_at;
        delete ret.deleted_at;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
