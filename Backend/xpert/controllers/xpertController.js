const Xpert = require("../../models/xpertModel");
const jwt = require("jsonwebtoken");

const xpertController = {
  registerXpert: async (req, res) => {
    try {
      const { email, mobileNumber, categories, subCategories } = req.body;

      if (email != undefined) {
        const existedXpert = await Xpert.findOne({ email });

        if (existedXpert) {
          return res.status(409).json({
            status: false,  
            message: "Xpert with this email already exists",
          });
        }
      } else if (mobileNumber != undefined) {
        const existedXpert = await Xpert.findOne({ mobileNumber });

        if (existedXpert) {
          return res.status(409).json({
            status: false,
            message: "Xpert with this mobile number already exists",
          });
        }
      }

      let xpert = await Xpert.create({
        email,
        mobileNumber,
        categories,
        subCategories
      });

      xpert = await Xpert.findById(xpert._id).select("-otp");

      return res.status(201).json({
        status: true,
        message: "Xpert registered successfully",
        data: xpert,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  loginXpert: async (req, res) => {
    try {
      const { email, mobileNumber } = req.body;
      let check;

      if (email) {
        check = await Xpert.findOne({ email }).select("-otp");
      } else if (mobileNumber) {
        check = await Xpert.findOne({ mobileNumber }).select("-otp");
      }

      if (!check) {
        const errorMessage = email
          ? "Xpert with this email not found. Please check your email."
          : "Xpert with this mobile number not found. Please check your mobile number.";

        return res.status(404).json({
          status: false,
          message: errorMessage,
        });
      }

      const payload = {
        email: email || null,
        mobileNumber: mobileNumber || null,
        xpertId: check._id,
      };

      const token = jwt.sign(payload, process.env.JWT_TOKEN);

      const otpMessage = email
        ? "registered email"
        : "registered mobile number";

      return res.status(200).json({
        status: true,
        message: `OTP sent successfully to your ${otpMessage}`,
        data: check,
        token: token,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  resendOtp: async (req, res) => {
    try {
      let value;

      if (req.body.email) {
        value = await Xpert.findOne({
          email: req.body.email,
        });
      } else if (req.body.mobileNumber) {
        value = await Xpert.findOne({
          mobileNumber: req.body.mobileNumber,
        });
      }

      // console.log(value, "valueee");

      if (value) {
        value.otp = 123456;
        await value.save();

        let message;
        if (req.body.email) {
          message = `OTP sent to your registered email: ${req.body.email}`;
        } else if (req.body.mobileNumber) {
          message = `OTP sent to your registered mobile number: ${req.body.mobileNumber}`;
        }

        res.status(200).json({
          status: true,
          message: message,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Xpert not found",
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

  verifyOtp: async (req, res) => {
    try {
      const id = req.params.id;
      const otp = req.body.otp;

      let check = await Xpert.findOne({ _id: id });

      if (!check) {
        res.status(400).json({
          status: false,
          message: "Not registered Xpert.",
        });
      } else {
        const payload = {
          email: check.email || null,
          mobileNumber: check.mobileNumber || null,
          xpertId: check._id,
        };

        const token = jwt.sign(payload, process.env.JWT_TOKEN);

        if (check.otp === otp) {
          res.status(200).json({
            status: true,
            message: "Otp verified successfuly",
            token: token,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Invalid Otp",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "somethig went wrong",
        error: error.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const id = req.params.id;

      let check = await Xpert.findOne({ _id: id });
      if (!check) {
        res.status(400).json({
          status: false,
          message: "Invalid Xpert or not found.",
        });
      } else {
        const existingUser = await Xpert.findOne({
          $or: [
            { email: req.body.email },
            { mobileNumber: req.body.mobileNumber },
          ],
          _id: { $ne: id },
        });

        if (existingUser) {
          return res.status(400).json({
            status: false,
            message: "Email or mobile number already exists.",
          });
        }
        const payload = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          mobileNumber: req.body.mobileNumber,
          dateOfBirth: req.body.dateOfBirth,
          address: req.body.address,
        };

        const updatedData = await Xpert.findByIdAndUpdate(id, payload, {
          new: true,
        }).select("-otp");

        if (updatedData) {
          res.status(200).json({
            status: true,
            message: "Profile Updated Successfuly.",
            data: updatedData,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Profile not updated, encountered an error.",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "somethig went wrong",
        error: error.message,
      });
    }
  },
};

module.exports = xpertController;
