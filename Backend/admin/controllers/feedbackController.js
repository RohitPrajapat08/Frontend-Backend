const Review = require("../../models/reviewModel");

const feedbackController = {
  getReview: async (req, res) => {
    try {
      const id = req.query.reviewId;
      const rating = req.query.rating;
      if (id) {
        const review = await Review.findOne({ _id: id });
        if (review) {
          res.status(200).json({
            status: true,
            message: "Review data found successfuly.",
            data: review,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Review data not found with this id.",
          });
        }
      } else if (rating) {
        const review = await Review.find({ rating });
        res.status(200).json({
          status: true,
          message: "Reviews data found successfuly.",
          data: review,
        });
      } else {
        const review = await Review.find();
        if (review.length > 0) {
          res.status(200).json({
            status: true,
            message: "Reviews data found successfuly.",
            data: review,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Reviews data not found.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const id = req.params.id;

      if(id){
        const deletedReview = await Review.findByIdAndDelete(id)

        if(deletedReview){
            res.status(200).json({
                status: true,
                message: "Review deleted successfully.",
                data: deletedReview
            })
        }else{
            res.status(500).json({
                status: false,
                message: "Review not deleted or not found.",
            })
        }
      }else{
        res.status(400).json({
            status: false,
            message: "Plese send Review id in params.",
        })
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  },
};

module.exports = feedbackController;
