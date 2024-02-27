const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    otp: {
      type: Number,
      default: 123456,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
