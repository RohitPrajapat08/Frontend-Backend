const userModel = require("../../models/userModel");

const userController = {
  addUser: async (req, res) => {
    try {
      let profileImage;

      if (req.file) {
        profileImage = req.file.location;
      } else if (req.body.profileImage && req.body.profileImage.location) {
        profileImage = req.body.profileImage.location;
      }

      console.log("---F-->", req.file);

      const { firstName, lastName, email, mobileNumber, gender, dateOfBirth } =
        req.body;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email already exists",
        });
      }

      const userDetail = await userModel.create({
        profileImage,
        fullName: `${firstName} ${lastName}`,
        email,
        mobileNumber,
        gender,
        dateOfBirth,
      });

      return res.status(201).json({
        status: true,
        message: "User created successfully",
        data: userDetail,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: `Error: ${error.message}`,
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const userId = req.params.id;
      console.log("userid--", userId);
      if (!userId) {
        const endUserInfo = await userModel.find();
        const userCount = await userModel.countDocuments();
        return res.status(200).json({
          status: true,
          data: endUserInfo,
          count: userCount,
        });
      }
      const endUserInfo = await userModel.findById({ _id: userId });
      if (!endUserInfo) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return res.status(201).json({
        status: true,
        message: "User found sucessfully",
        data: endUserInfo,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: `Error: ${error.message}`,
      });
    }
  },

  editUserDetails: async (req, res) => {
    try {
      const id = req.params.id;

      if (req.body.email) {
        const existingUser = await userModel.findOne({
          email: req.body.email,
          _id: { $ne: id },
        });
        if (existingUser) {
          return res.status(400).json({
            status: false,
            message: "Email already exists",
          });
        }
      }

      let updateFields = { ...req.body };

      if (req.file) {
        updateFields.profileImage = req.file.location;
      } else if (req.body.profileImage && req.body.profileImage.location) {
        updateFields.profileImage = req.body.profileImage.location;
      }

      if (req.body.firstName && req.body.lastName) {
        updateFields.fullName = `${req.body.firstName} ${req.body.lastName}`;
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: updateFields,
        },
        { new: true }
      );
      if (!updatedUser) {
        // User not found
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // User found and updated successfully
      return res.status(200).json({
        status: true,
        message: "User details updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: `Error: ${error.message}`,
      });
    }
  },

  UserStatus: async (req, res) => {
    try {
      const userId = req.params.id;
      const updateUserStatus = await userModel.findOneAndUpdate(
        { _id: userId },
        { suspendStatus: true }
      );
      if (!updateUserStatus) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "User suspended successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        err: error.message,
      });
    }
  },

  // userSortByDate: async (req, res) => {
  //     try {
  //         const getListofUsers = await userModel.find().sort({ createdAt: -1 });
  //         if (!getListofUsers) {
  //             return res.status(404).json({
  //                 status: false,
  //                 message: "User not found"
  //             });
  //         }
  //         return res.status(200).json({
  //             status: true,
  //             message: "User found successfuly.",
  //             data: getListofUsers
  //         })
  //     } catch (error) {
  //         return res.status(500).json({
  //             status: false,
  //             message: "Internal server error",
  //             error: error.message
  //         });
  //     }
  // },
};
module.exports = userController;
