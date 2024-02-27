const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const expertSchema = new Schema(
  {
    title: {
      type: String,
      enum: ["Mr", "Mrs"],
    },

    profileImage: {
      type: String,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: Number,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    aadharNumber: {
      type: Number,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    SEBIRegNumber: {
      type: String,
      trim: true,
    },
    AMFIRegNumber: {
      type: String,
      trim: true,
    },
    howDidYouHearAboutUs: {
      type: String,
      trim: true,
    },
    otherDetails: {
      type: String,
      trim: true,
    },
    otp: {
      type: Number,
      default: 123456,
    },
    language: {
      type: [String],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dateOfBirth: {
      type: Date,
    },
    pinCode: {
      type: Number,
    },
    city: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    categories: [mongoose.Schema.Types.ObjectId],
    subCategories: [mongoose.Schema.Types.ObjectId],

    categoryCertificates: [
      {
        _id: false,
        file: { type: String },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
    subCategoryCertificates: [
      {
        _id: false,
        file: { type: String },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],

    categoryRegNumber: [String],
    subCategoryRegNumber: [String],

    qualificationProofImages: [
      {
        _id: false,
        file: { type: String },
        fileName: { type: String },
      },
    ],
    qualification: {
      type: String,
    },
    identityProofImages: [
      {
        _id: false,
        file: { type: String },
        fileName: { type: String },
      },
    ],
    customerStories: {
      type: Number,
    },
    starRating: {
      type: Number,
    },
    experties: {
      type: String,
    },
    experience: {
      type: String,
    },
    xpertStatus: {
      type: Boolean,
      default: true,
    },
    verifiedDhanExpert: {
      type: Boolean,
    },
    verifiedSebiRegisterd: {
      type: Boolean,
    },
    consultancyName: {
      type: String,
    },
    appointementFee: {
      type: Number,
    },
    onlineStatus: {
      type: Boolean,
    },
    gallery: {
      type: [String],
    },
    awardRecognition: {
      type: String,
    },
    degreeCertification: {
      type: String,
    },
    weekDay: {
      type: String,
    },
    availableFrom: {
      type: String,
    },
    availableTo: {
      type: String,
    },
    address: {
      type: String,
    },
    aboutExpert: {
      type: String,
    },
    aumRange: {
      type: String,
    },
    communicationOption: {
      type: [String],
    },
    videoCall: {
      type: Boolean,
    },
    callConsultFee: {
      type: Number,
    },
    videoConsultationfee: {
      type: Number,
    },
    phoneCall: {
      type: Boolean,
    },
    textConversation: {
      type: Boolean,
    },
    actualVisit: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Expert = mongoose.model("Expert", expertSchema);

module.exports = Expert;
