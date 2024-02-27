require('dotenv').config();
const router = require("express").Router();
const {adminAuthAuthenticated} = require("../../services/jwt")
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController")
const questionController = require("../controllers/questionController")
const feedbackController = require("../controllers/feedbackController")
const bookingController = require("../controllers/bookingController")
const teamMemberController = require("../controllers/teamMemberController")
const upload = require("../../services/multer")

// const multer = require("multer")
//  const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });


//^ Admin routes --------------------------------
router.post("/signUp", adminController.adminSignup);
router.post("/login", adminController.adminLogin);
router.get("/verifyOTP", adminController.verifyOTP);
router.post("/forgetPassword", adminController.forgetPassword);
router.get("/confirmOTP", adminController.confirmOTP);
router.patch("/createAndConfirmNewPass", adminController.createAndConfirmNewPass);

//^ Category Routes---------------------
router
  .route("/category/:id?")
  .all(adminAuthAuthenticated)
  .post(upload.single("iconImage"), categoryController.createCategory)
  .get(categoryController.getCategory)
  .patch(upload.single("iconImage"), categoryController.updateCategory)
  .delete( categoryController.deleteCategory)
  
//^ Sub Category Routes---------------------
router
  .route("/subCategory/:id?")
  .all(adminAuthAuthenticated)
  .post(upload.single("iconImage"), categoryController.createSubCategory)
  .patch(upload.single("iconImage"), categoryController.updateSubCategory)
  .get(categoryController.getSubCategory)
  .delete(categoryController.deleteSubCategory)

//* Question routes------------------
router
  .route("/question/:id?")
  .all(adminAuthAuthenticated)
  .post(questionController.createQuestion)
  .patch(questionController.updateQuestion)
  .get(questionController.getQuestion)
  .delete(questionController.deleteQuestion)
// router.patch("/questionStatus/:id", adminAuthAuthenticated, questionController.updateQuestionStatus)

// * Feedback Routes
router
  .route("/review/:id?")
  .all(adminAuthAuthenticated)
  .get(feedbackController.getReview)
  .delete(feedbackController.deleteReview)

// * Appointement
router.get("/appointement",adminAuthAuthenticated, bookingController.getAppointement)
router.patch("/appointementStatus/:id",adminAuthAuthenticated, bookingController.updateAppointementStatus)
router.get("/filterByStatus", adminAuthAuthenticated, bookingController.getAppointementByStatus )

// ~ Team Member Routes
router
  .route("/teamMember/:id?")
  .all(adminAuthAuthenticated)
  .post(upload.single("profileImage"), teamMemberController.addMember)
  .get(teamMemberController.getMember)
  .patch(upload.single("profileImage"), teamMemberController.updateMember)
  .delete(teamMemberController.deleteMember)

module.exports = router;
