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
  // { _id: false } 
);

const questionSchema = new Schema(
  {
    questionType:{
      type: String,
      enum: ["Investment Objective", "Return Expectations", "Risk Profile"]
    },
    question: {
      type: String,
      trim: true,
    },
    options: [optionSchema],
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "deactive"
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
