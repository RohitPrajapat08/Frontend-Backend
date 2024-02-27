const router = require("express").Router();
const { XpertAuthAuthenticated } = require("../../services/jwt.js")
const xpertController = require("../controllers/xpertController.js")
const appointementController = require("../../user/controller/appointementController.js")

router.post("/register", xpertController.registerXpert)
router.post("/verify-otp/:id", xpertController.verifyOtp)
router.post("/login", xpertController.loginXpert)
router.patch("/update-profile/:id", XpertAuthAuthenticated, xpertController.updateProfile)



// ^ Appointement Routes
router.patch("/action/:id", XpertAuthAuthenticated, appointementController.XpertActionOnBooking)
router.get("/getXpertAppointement/:id?", XpertAuthAuthenticated, appointementController.getXpertAppointment)

module.exports = router