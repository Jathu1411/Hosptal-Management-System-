const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is mandatory"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    nic: {
      type: String,
      required: [true, "NIC number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    post: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    grade: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
