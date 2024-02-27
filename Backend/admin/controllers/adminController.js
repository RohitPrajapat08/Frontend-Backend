const adminModel = require('../../models/adminModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const slatRound = 10;

const adminController = {
  adminSignup: async (req, res) => {
    try {
      let { email, password } = req.body;
      console.log(email, password)
      if(!email || !password){
        return res.status(404).json({
          status: false,
          message: "please enter all filds",
        });
      }
      let check = await adminModel.findOne({ email });
      if (check != null) {
        return res.status(200).json({
          status: false,
          message: "username already exist",
          result: check,
        });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const adminRecord = new adminModel({
        email: email,
        password: hashPassword
      });
      await adminRecord.save();
      return res.status(201).json({
        status: true,
        message: "successfully signup",
        newUser: adminRecord,
      });

    } catch (error) {
      res.status(400).json({
        status: false,
        message: "something went wrong",
        err: error.message,
      });
    }
  },

  // adminLogin: async (req, res) => {
  //   let { email, password } = req.body;
  //   try {
  //     if (!email && !password) {
  //       return res.json({ message: "Please provide email and password" });
  //     }
  //     const isadminExist = await adminModel.findOne({ email: email });
  //     if (!isadminExist) {
  //       return res.status(400).json({
  //         status: false,  
  //         message: "Invalid email",
  //       });
  //     }
  //     const isMatch = bcrypt.compare(password, isadminExist.password);
  //     if (!isMatch) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Please enter a valid password",
  //       });
  //     }
  //     const payload = {
  //       email: isadminExist.email,
  //       id: isadminExist._id,
  //     };
  //     const token = jwt.sign(payload, process.env.JWT_TOKEN);
  //     return res.status(200).json({
  //       status: true,
  //       message: "Successfully Logged in",
  //       token: token,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: false,
  //       message: "Internal server error",
  //       error: error.message,
  //     });
  //   }
  // },
  adminLogin: async (req, res) => {
    let { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.json({ message: "Please provide email and password" });
      }
      const isadminExist = await adminModel.findOne({ email: email });
      if (!isadminExist) {
        return res.status(400).json({
          status: false,
          message: "Invalid email",
        });
      }
      // Await the result of bcrypt.compare
      const isMatch = await bcrypt.compare(password, isadminExist.password);
      if (!isMatch) {
        return res.status(400).json({
          status: false,
          message: "Please enter a valid password",
        });
      }
      const payload = {
        email: isadminExist.email,
        id: isadminExist._id,

      };
      const token = jwt.sign(payload, process.env.JWT_TOKEN);
      return res.status(200).json({
        status: true,
        message: "Successfully Logged in",
        token: token,
        email: email,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  
  verifyOTP: async (req, res) => {
    try {
      const { otp } = req.body;
      if (!isNaN(otp)) {
        const storedOTP = await adminModel.findOne({ otp }, { otp: 1 });
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

  forgetPassword: async (req, res) => {
    try {
      const email = req.body;
      if (!email) {
        return res.status(200).json({
          status: "failed",
          message: " Email must be Enter",
        });
      }
      const isMatchEmail = await adminModel.findOne(email);
      if (!isMatchEmail) {
        return res.status(400).json({
          status: false,
          message: "User Not Found",
        });
      }
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      await adminModel.findOneAndUpdate(email, { otp: generatedOtp });
      return res.status(200).json({
        status: "true",
        OTP: generatedOtp,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  confirmOTP: async (req, res) => {
    try {
      const otp = req.body;
      if (!otp) {
        return res.status(400).json({
          status: "failed",
          message: " Please Enter OTP",
        });
      }
      const isMatchOTP = await adminModel.findOne(otp);
      if (!isMatchOTP) {
        return res.status(400).json({
          status: "failed",
          message: " Invalid OTP",
        });
      } else {
        return res.status(200).json({
          status: "Sucess",
          message: "Verify OTP",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  createAndConfirmNewPass: async (req, res) => {
    try {
      const { email, newPassword, confirmNewPass } = req.body;
      if (!newPassword && !confirmNewPass) {
        return res.status(400).json({
          status: "failed",
          message: " all filed must be required",
        });
      }
      if (newPassword !== confirmNewPass) {
        return res.status(400).json({
          status: "failed",
          message: " confirm password does't match",
        });
      } else {
        const salt = await bcrypt.genSalt(slatRound);
        const hasedPassword = await bcrypt.hash(newPassword, salt);
        const updatedPass = await adminModel.findOneAndUpdate(
          { email },
          { password: hasedPassword }
        );
        return res.status(201).json({
          status: "Sucess",
          message: " Password updated sucessfull",
          data: updatedPass,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

module.exports = adminController;
