const router = require("express").Router();
const { userAuthAuthenticated } = require("../../services/jwt.js")
const userController = require("../controller/userController.js")
const reviewController = require("../controller/reviewController.js")
const appointementController = require("../controller/appointementController.js")
const upload = require("../../services/multer.js")

// ^ User Router
router.post("/registerUser", userController.registerUser)
router.post("/loginUser", userController.loginUser)
router.post("/resendOtp", userController.resendOtp)
router.get("/verifyOTP", userController.verifyOTP)
router.patch("/updateUserProfile/:id", upload.single("profileImage"), userController.updateUserProfile)
router.post("/deleteUser/:id", userController.deleteUser)
router.get('/location_details', userController.location_details);
router.get("/search", userController.search)

// * Protected Routes Xser side
router.post("/bookAppointement", userAuthAuthenticated,  appointementController.bookAppointement)
router.patch("/updateAppointement/:id",userAuthAuthenticated, appointementController.updateAppointement)
router.get("/getBooking",userAuthAuthenticated, appointementController.getBooking)
router.patch("/actonOnBooking/:id",userAuthAuthenticated, appointementController.actonOnBooking)

// & protected routes
//^ Revies Router
router.post("/review", userAuthAuthenticated, reviewController.review)

// ^ User Answers Router
router.patch("/userAnswers", userAuthAuthenticated, userController.userAnswers)

module.exports = router