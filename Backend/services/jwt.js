const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const xpertModel = require("../models/xpertModel");
const adminModel = require("../models/adminModel");

exports.adminAuthAuthenticated = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "please login",
    });
  } else {
    try {
      const verified = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = verified;
      const check = await adminModel.find({ _id: verified.id });
      if (check.length > 0) {
        if (check) {
          next();
        } else {
          res.status(401).json({
            status: 401,
            message: "You Are Blocked! Kindly contact your admin ",
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          message: "invalid token",
        });
      }
    } catch (error) {
      res.status(401).json({
        status: false,
        messages: error.message,
      });
    }
  }
};
exports.userAuthAuthenticated = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "please login",
    });
  } else {
    try {
      const verified = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = verified;
      const check = await userModel.find({ _id: verified.userId });
      if (check.length > 0) {
        if (check) {
          next();
        } else {
          res.status(401).json({
            status: 401,
            message: "You Are Blocked! Kindly contact your admin ",
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          message: "invalid token",
        });
      }
    } catch (error) {
      res.status(401).json({
        status: false,
        message: "something went wrong",
      });
    }
  }
};

exports.XpertAuthAuthenticated = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "please login",
    });
  } else {
    try {
      const verified = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = verified;
      const check = await xpertModel.find({ _id: verified.xpertId });
      if (check.length > 0) {
        if (check) {
          next();
        } else {
          res.status(401).json({
            status: 401,
            message: "You Are Blocked! Kindly contact your admin ",
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          message: "invalid token",
        });
      }
    } catch (error) {
      res.status(401).json({
        status: false,
        message: "something went wrong",
      });
    }
  }
};
