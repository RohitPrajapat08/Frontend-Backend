const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true
  },
  rating: {
    type: Number,
  },
  date: {
    type: Date,
  },
  review: {
    type: String,
  },
  xpertResponce: {
    type: String
  }
}, {
  timestamps: true
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
