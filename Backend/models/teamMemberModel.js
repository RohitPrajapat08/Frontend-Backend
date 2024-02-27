const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamMemberSchema = new Schema(
  {
    profileImage: {
      type: String,
    },
    fullName: {
      type: String,
      trim: true,
    },
    dateOfRegistration: {
      type: Date,
      default: Date.now(),
    },
    role: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: Number,
    },
    email: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
      type: Date,
    },
    designation: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Deactive"],
      default: "Deactive",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = TeamMember;
