const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    mobileNumber: {
      type: Number,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    otp: {
      type: Number,
      default: 123456,
    },
    pincode: {
      type: Number,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    suspendStatus: {
      type: Boolean,
      default: false,
    },
    deleteStatus: {
      type: Boolean,
      default: false,
    },
    profession: {
      type: String,
    },
    designation: {
      type: String,
    },
    carOwnership: {
      type: Boolean,
    },
    familyMembers: {
      type: Number,
    },
    creditCardOwner: {
      type: Boolean,
    },
    salaryRange: {
      type: String,
    },
    domainInterest: {
      type: String,
    },
    experienceLevel: {
      type: String,
    },
    returnExpectation: {
      type: String,
    },
    investibleSurplus: {
      type: String,
    },
    questionAnswer: [
      {
        _id: false,
        question: {
          type: String,
          trim: true,
        },
        options: [optionSchema],
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
