const { Console } = require("console");
const Review = require("../../models/reviewModel");

const reviewController = {
  review: async (req, res) => {
    try {
      const userId = req.user && req.user.userId ? req.user.userId : null;

      const { expertId, rating, date, review } = req.body;

      const newReview = await Review.create({
        rating,
        date: date || Date.now(),
        review,
        userId: userId,
        expertId: expertId,
      });
      res.status(201).json({
        status: true,
        message: "Review added successfully",
        data: newReview,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to add review",
        error: error.message,
      });
    }
  },
};

module.exports = reviewController