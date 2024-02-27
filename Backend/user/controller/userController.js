const User = require("../../models/userModel.js");
const mongoose = require("mongoose");
const axios = require("axios");
const Expert = require("../../models/xpertModel.js");
const jwt = require("jsonwebtoken");
const Category = require("../../models/categoryModel.js");
const apiKey = "1a99728acdb34a428f8c6e6611d63a07";
const geocodingEndpoint = "https://api.opencagedata.com/geocode/v1/json";

const userController = {
  registerUser: async (req, res) => {
    try {
      const { fullName, email, mobileNumber } = req.body;

      if (email != undefined) {
        const existedUser = await User.findOne({ email });

        if (existedUser) {
          return res.status(409).json({
            status: false,
            message: "User with this email already exists",
          });
        }
      } else if (mobileNumber != undefined) {
        const existedUser = await User.findOne({ mobileNumber });

        if (existedUser) {
          return res.status(409).json({
            status: false,
            message: "User with this mobile number already exists",
          });
        }
      }

      let user = await User.create({
        fullName,
        email,
        mobileNumber,
      });

      user = await User.findById(user._id).select("-otp");

      return res.status(201).json({
        status: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: `Error: ${error.message}`,
      });
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({
          status: false,
          message: "User not found with this id",
        });
      }

      let profileImage;

      if (req.file) {
        profileImage = req.file.location;
      } else if (req.body.profileImage && req.body.profileImage.location) {
        profileImage = req.body.profileImage.location;
      }

      const emailExists = await User.findOne({
        $or: [
          { email: req.body.email },
          { mobileNumber: req.body.mobileNumber },
        ],
        _id: { $ne: userId },
      });

      if (emailExists) {
        return res.status(400).json({
          status: false,
          message: "Email or mobile number already exists",
        });
      }

      const payload = {
        profileImage,
        fullName: req.body.fullName,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        dateOfBirth: req.body.dateOfBirth,
        profession: req.body.profession,
        designation: req.body.designation,
        address: req.body.address,
        salaryRange: req.body.salaryRange,
        domainInterest: req.body.domainInterest,
        experienceLevel: req.body.experienceLevel,
        returnExpectation: req.body.returnExpectation,
        investibleSurplus: req.body.investibleSurplus,
        carOwnership: req.body.carOwnership,
        familyMembers: req.body.familyMembers,
        creditCardOwner: req.body.creditCardOwner,
      };

      console.log(payload, "payload%%%%%%%%%%%%");

      const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
      }).select("-otp");

      if (updatedUser) {
        return res.status(200).json({
          status: true,
          message: "Successfully updated record",
          data: updatedUser,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Data not updated",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, mobileNumber } = req.body;
      let check;

      if (email) {
        check = await User.findOne({ email }).select("-otp");
      } else if (mobileNumber) {
        check = await User.findOne({ mobileNumber }).select("-otp");
      }

      if (!check) {
        const errorMessage = email
          ? "User with this email not found. Please check your email."
          : "User with this mobile number not found. Please check your mobile number.";

        return res.status(404).json({
          status: false,
          message: errorMessage,
        });
      }

      const payload = {
        email: email || null,
        mobileNumber: mobileNumber || null,
        userId: check._id,
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

  verifyOTP: async (req, res) => {
    try {
      const { otp } = req.body;
      if (!isNaN(otp)) {
        const storedOTP = await User.findOne({ otp }, { otp: 1 });
        if (storedOTP === null) {
          return res.status(400).json({
            status: "Failed",
            message: "Invalid OTP",
          });
        } else {
          return res.status(201).json({
            status: "Success",
            message: "OTP verification successful ",
          });
        }
      } else {
        return res.status(404).json({
          status: "Failed",
          message: "Please Entered a Valid OTP",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "Failed",
        message: `Error: Internal Server Error`,
      });
    }
  },

  resendOtp: async (req, res) => {
    try {
      let value;

      if (req.body.email) {
        value = await User.findOne({
          email: req.body.email,
        });
      } else if (req.body.mobileNumber) {
        value = await User.findOne({
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
          message: "User not found",
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

  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;

      const check = await User.findOne({ _id: id });

      if (check) {
        const deleteStatus = req.body.deleteStatus;

        if (typeof deleteStatus === "boolean") {
          if (deleteStatus === false) {
            // Delete the user from the database
            const deletedUser = await User.findByIdAndDelete(id);

            res.status(200).json({
              status: true,
              message: "User permanently deleted successfully",
              data: deletedUser,
            });
          } else {
            // Update the user's deleteStatus to true
            const updatedUser = await User.findByIdAndUpdate(
              id,
              { $set: { deleteStatus: true } },
              { new: true }
            );

            res.status(200).json({
              status: true,
              message: "User temporarily deleted successfully",
              data: updatedUser,
            });
          }
        } else {
          res.status(400).json({
            status: false,
            message: "Invalid deleteStatus value",
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  location_details: async (req, res) => {
    const { pincode } = req.body;

    try {
      const response = await axios.get(geocodingEndpoint, {
        params: {
          key: apiKey,
          q: pincode,
          countrycode: "IN",
        },
      });

      const results = response.data.results;
      if (results.length > 0) {
        const location = results[0].formatted;
        console.log(`locationDetails: ${location}`);
        return res.status(200).json({
          status: "Succes",
          locationDetails: location,
        });
      } else {
        return res.status(404).json({
          status: failed,
          error: `No location details found for PIN code ${pincode}`,
        });
      }
    } catch (error) {
      console.error("Error fetching location details:", error.message);
      res.status(500).json({
        status: "failed",
        error: "Internal Server Error",
      });
    }
  },

  userAnswers: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { questionAnswer } = req.body;

      const user = await User.findById(userId).select("-otp");
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      questionAnswer.forEach(({ question, options }) => {
        // Add a new question and answers
        const trimmedOptions = options.map((option) => ({
          text: option.text.trim(),
          points: option.points,
        }));

        user.questionAnswer.push({
          question: question.trim(),
          options: trimmedOptions,
        });
      });

      await user.save();

      res.status(200).json({
        status: true,
        message: "QuestionAnswer field updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  search: async (req, res) => {
    try {
      const query = {};

      if (req.query.name) {
        const nameRegex = new RegExp(req.query.name, "i");
        query.firstName = { $regex: nameRegex };
      }

      if (
        req.query.nearbyMe &&
        req.query.longitude &&
        req.query.latitude &&
        req.query.maxDistance
      ) {
        const maxDistance = parseInt(req.query.maxDistance) || 10000;
        query.location = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [
                parseFloat(req.query.longitude),
                parseFloat(req.query.latitude),
              ],
            },
            $maxDistance: maxDistance,
          },
        };
      }

      if (req.query.pincode) {
        query.pinCode = parseInt(req.query.pincode);
      }

      if (req.query.consultancyName) {
        query.consultancyName = req.query.consultancyName;
      }

      if (req.query.keyword) {
        const keywordRegex = new RegExp(req.query.keyword, "i");
        query.$or = [
          { firstName: { $regex: keywordRegex } },
          { lastName: { $regex: keywordRegex } },
          { experties: { $regex: keywordRegex } },
          { category: { $regex: keywordRegex } },
        ];
      }

      if (req.query.category) {
        query.categories = req.query.category;
      }

      if (req.query.rating) {
        query.starRating = { $gte: parseFloat(req.query.rating) };
      }

      if (req.query.price) {
        query.appointmentFee = { $lte: parseInt(req.query.price) };
      }

      if (req.query.locationFilter) {
        query.city = req.query.locationFilter;
      }

      let sortQuery = {};
      if (req.query.sortBy) {
        sortQuery[req.query.sortBy] = req.query.order === "desc" ? -1 : 1;
      } else {
        sortQuery.createdAt = -1;
      }

      const results = await Expert.find(query)
        .sort(sortQuery)
        .populate({
          path: "categories.category",
          select: "categoryName description subCategories",
          model: "Category",
        })
        .exec();

      results.map((expert) => {
        if (expert.categories && Array.isArray(expert.categories)) {
          expert.categories.forEach((category) => {
            if (
              category.category &&
              category.category.subCategories &&
              Array.isArray(category.category.subCategories)
            ) {
              category.category.subCategories =
                category.category.subCategories.filter((subCategory) =>
                  category.subCategories.includes(subCategory._id.toString())
                );
            }
          });
        }

        // Omit subCategories at the top level
        const { subCategories, ...formattedExpert } = expert;

        return {
          ...formattedExpert,
          categories: (expert.categories || []).map(
            ({ subCategories, ...category }) => category
          ),
        };
      });

      res.status(200).json({
        status: true,
        message: "Data found successfully",
        data: results,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
};

module.exports = userController;
