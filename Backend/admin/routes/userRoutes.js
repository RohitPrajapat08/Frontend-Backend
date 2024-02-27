const router= require('express').Router();
const userController = require('../controllers/userController')
const {adminAuthAuthenticated}= require('../../services/jwt')
const upload= require('../../services/multer')

router.patch('/updateUserStatus/:id', adminAuthAuthenticated, userController.UserStatus);
router
.route("/user/:id?")
  .all(adminAuthAuthenticated)
  .post(upload.single('profileImage'), userController.addUser)
  .get(userController.getUser)
  .patch(upload.single('profileImage'), userController.editUserDetails)
module.exports= router;