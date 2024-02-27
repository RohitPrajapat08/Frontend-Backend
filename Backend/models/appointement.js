const mongoose = require("mongoose");

const appointementSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointementConfirmedInstantly: {
      type: Boolean,
      default: false,
    },
    category:{
        type: String
    },
    appointementType: {
      type: Boolean,        // Offline visit  / Online consultation
    },
    bookingDate: {
      type: Date,
    },
    bookingSlot: {
      type: String,
    },
    communicationMode: {
        type: String
    },
    duration: {
      type: String,
    },
    zoomLink: {
      type: String,
    },
    details: {
        type: String
    },
    appointementStatus: {
      type: String,
      enum: ["pending", "accepted" ,"completed", "failed", "cancelled", "rescheduled", "recurring"],
      default: "pending",
    },

    reasonForCancel: {
      type: String
    },
    reScheduleDate: {
      type: Date,
    },
    reBookingSlot: {
      type: String,
    },

  },
  { timestamps: true }
);

const Appointement = mongoose.model("Appointement", appointementSchema);

module.exports = Appointement;
