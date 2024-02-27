const { match } = require("assert");
const Appointement = require("../../models/appointement");
const Question = require("../../models/questionModel");

const appointementController = {
  //* User side controller
  bookAppointement: async (req, res) => {
    try {
      const {
        userId,
        expertId,
        category,
        appointementConfirmedInstantly,
        bookingDate,
        bookingSlot,
        communicationMode,
        details,
      } = req.body;

      let appointement = await Appointement.create({
        userId,
        expertId,
        category,
        appointementConfirmedInstantly,
        bookingDate,
        bookingSlot,
        communicationMode,
        details,
      });
      appointement = await Appointement.findById(appointement._id);

      return res.status(201).json({
        status: true,
        message: "Appointement Booked successfully",
        data: appointement,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  updateAppointement: async (req, res) => {
    try {
      const id = req.params.id;

      const check = await Appointement.findOne({ _id: id });

      if (check) {
        const updatedFields = {
          userId: req.body.userId,
          expertId: req.body.expertId,
          category: req.body.category,
          appointementConfirmedInstantly:
            req.body.appointementConfirmedInstantly,
          bookingDate: req.body.bookingDate,
          bookingSlot: req.body.bookingSlot,
          communicationMode: req.body.communicationMode,
          details: req.body.details,
        };
        console.log(updatedFields, "updatedFields%%%%%%%%%%%%");

        let updatedAppointement = await Appointement.findByIdAndUpdate(
          id,
          updatedFields,
          {
            new: true,
          }
        );

        if (updatedAppointement) {
          res.status(200).json({
            status: true,
            message: "Successfully updated Appointement",
            data: updatedAppointement,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Data not updated",
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "Data not found with this id",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  getBooking: async (req, res) => {
    try {
      const id = req.query.id;
      const userId = req.user.userId;
      const expertId = req.query.expertId;

      console.log(userId, "UserId");

      let query = {};

      if (id) {
        query = { _id: id, userId: userId };
      } else if (userId) {
        if (expertId) {
          query = { userId: userId, expertId: expertId };
        } else {
          query = { userId: userId };
        }
      } else if (expertId) {
        query = { expertId: expertId };
      }

      console.log(query, "query");

      const appointments = await Appointement.find(query)
        .populate({
          path: "userId",
          populate: {
            path: "questionAnswer.question",
            select: "questionType question options",
          },
        })
        .populate("expertId")
        .exec();

      appointments.forEach((appointment) => {
        if (
          appointment.userId &&
          appointment.userId.questionAnswer &&
          appointment.userId.questionAnswer.length > 0
        ) {
          appointment.userId.questionAnswer.forEach((qa) => {
            if (qa.question && qa.question.options) {
              qa.question.options = qa.question.options.filter((option) =>
                qa.options.includes(option._id)
              );
            }
          });
        }
      });

      if (appointments.length > 0) {
        res.status(200).json({
          status: true,
          message: "Appointments data found successfully",
          data: appointments,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Appointments data not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  actonOnBooking: async (req, res) => {
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
      return res.status(500).json({
        status: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  // * Xpert side controller------------------------------------------
  XpertActionOnBooking: async (req, res) => {
    try {
      const id = req.params.id;
      const { action, reasonForCancel, reScheduleDate, reBookingSlot } =
        req.body;

      let appointment = await Appointement.findOne({ _id: id });

      if (!appointment) {
        return res.status(404).json({
          status: false,
          message: "Appointment not found",
        });
      }
      switch (action) {
        case "accepted":
          appointment.appointementStatus = "accepted";
          break;
        case "cancelled":
          appointment.appointementStatus = "cancelled";
          appointment.reasonForCancel = reasonForCancel;
          break;
        case "rescheduled":
          appointment.appointementStatus = "rescheduled";
          appointment.reScheduleDate = reScheduleDate;
          appointment.reBookingSlot = reBookingSlot;
          break;
        default:
          return res.status(400).json({
            status: false,
            message: "Invalid action provided",
          });
      }
      await appointment.save();

      return res.status(200).json({
        status: true,
        message: `Appointment ${action} successfully`,
        data: appointment,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  getXpertAppointment: async (req, res) => {
    try {
      const expertId = req.user.xpertId;
      const appointmentId = req.params.id;

      const mapQuestionOptions = (questionAnswer) => {
        if (questionAnswer && questionAnswer.length > 0) {
          questionAnswer.forEach((qa) => {
            if (qa.question && qa.question.options) {
              qa.question.options = qa.question.options.filter((option) =>
                qa.options.includes(option._id)
              );
            }
          });
        }
      };

      let appointments;

      if (appointmentId) {
        const appointment = await Appointement.findOne({
          _id: appointmentId,
          expertId: expertId,
        })
          .populate({
            path: "userId",

            populate: {
              path: "questionAnswer.question",
              select: "questionType question options",
            },
          })
          .exec();

        if (!appointment) {
          return res.status(404).json({
            status: false,
            message: "Appointment not found",
          });
        }

        mapQuestionOptions(appointment.userId.questionAnswer);

        return res.status(200).json({
          status: true,
          message: "Appointment found successfully",
          data: appointment,
        });
      } else {
        appointments = await Appointement.find({ expertId: expertId })
          .populate({
            path: "userId",
            populate: {
              path: "questionAnswer.question",
              select: "questionType question options",
            },
          })
          .exec();

        appointments.forEach((appointment) => {
          mapQuestionOptions(appointment.userId.questionAnswer);
        });

        return res.status(200).json({
          status: true,
          data: appointments,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: ${error.message}`,
      });
    }
  },
};

module.exports = appointementController;
