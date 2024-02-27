const Appointement = require("../../models/appointement");

const booking = {
  getAppointement: async (req, res) => {
    try {
      const id = req.query.id;
      const userId = req.query.userId;
      const expertId = req.query.expertId;

      let query = {};

      if (id) {
        query._id = id;
      } else if (userId) {
        query.userId = userId;
      } else if (expertId) {
        query.expertId = expertId;
      }

      const results = await Appointement.find(query)
        .populate("userId")
        .populate({
          path: "expertId",
          populate: [
            { path: "categories", model: "Category" },
            { path: "subCategories", model: "SubCategory" },
          ],
        });
      let count = 0;

      if (id) {
        const result = await Appointement.findOne(query)
          .populate("userId")
          .populate({
            path: "expertId",
            populate: [
              { path: "categories", model: "Category" },
              { path: "subCategories", model: "SubCategory" },
            ],
          });
        count = result ? 1 : 0;
      } else {
        count = await Appointement.countDocuments(query)
          .populate("userId")
          .populate({
            path: "expertId",
            populate: [
              { path: "categories", model: "Category" },
              { path: "subCategories", model: "SubCategory" },
            ],
          });
      }

      if (results.length > 0) {
        res.status(200).json({
          status: true,
          message: id
            ? `Appointment found with id.`
            : userId
            ? `Appointments found with userId.`
            : expertId
            ? `Appointments found with expertId.`
            : "Appointment data found.",
          data: results,
          count: count,
        });
      } else {
        res.status(id || userId || expertId ? 400 : 404).json({
          status: false,
          message: id
            ? `Appointment not found with id.`
            : userId
            ? `Appointment not found with userId.`
            : expertId
            ? `Appointment not found with expertId.`
            : "No appointment data found.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "somethig went wrong",
        error: error.message,
      });
    }
  },

  updateAppointementStatus: async (req, res) => {
    try {
      const id = req.params.id;

      const appointement = await Appointement.findOne({ _id: id });

      if (appointement) {
        const payload = {
          appointementStatus: req.body.appointementStatus,
        };


        if(req.body.appointementStatus === "cancelled"){
          payload.reasonForCancel = req.body.reasonForCancel
        }else if(req.body.appointementStatus === "rescheduled"){
          payload.reScheduleDate = req.body.reScheduleDate,
          payload.reBookingSlot = req.body.reBookingSlot
        }

        const updatedResult = await Appointement.findByIdAndUpdate(
          id,
          payload,
          { new: true }
        );

        if (updatedResult) {
          res.status(200).json({
            status: true,
            message: `Appointement ${req.body.appointementStatus} successfully.`,
            data: updatedResult,
          });
        } else {
          res.status(400).json({
            status: false,
            message: `Appointement not ${req.body.appointementStatus}.`,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Appointement found not found with this id.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "somethig went wrong",
        error: error.message,
      });
    }
  },

  getAppointementByStatus: async (req, res) => {
    try {
      let appointementStatus = req.query.status;

      let appointement = await Appointement.find({
        appointementStatus: appointementStatus,
      })
        .populate({
          path: "userId",
          select: "_id fullName",
        })
        .populate({
          path: "expertId",
          select: "_id firstName lastName",
        });
      let count = await Appointement.countDocuments({
        appointementStatus: appointementStatus,
      });
      // console.log(appointement)
      if (appointement.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No Appointement found.",
        });
      }
      res.status(200).json({
        status: true,
        message: "Appointement found successfully.",
        data: appointement,
        count: count,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "somethig went wrong",
        error: error.message,
      });
    }
  },
};

module.exports = booking;
