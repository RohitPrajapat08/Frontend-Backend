const router= require('express').Router();
const expertController = require('../controllers/expertController')
const {adminAuthAuthenticated}= require('../../services/jwt')
const upload = require("../../services/multer")

const multerarray = [
    { name: 'categoryCertificates', maxCount: 10 },
    { name: 'subCategoryCertificates', maxCount: 10 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'file', maxCount: 10 }
   ]

router
    .route("/expert/:id?")
    .all(adminAuthAuthenticated)
    .post(upload.single("profileImage") ,expertController.registerExpertByAdmin)
    .get(expertController.getExpertController)
    .patch(upload.fields(multerarray),expertController.updateExpert)
    .delete(expertController.deleteExpert)

// router.patch('/enrollXpert/:id', adminAuthAuthenticated, upload.fields(multerarray), expertController.enrollXpert)
router.patch('/uploadDocs/:id', adminAuthAuthenticated, upload.single('file'), expertController.uploadDocs)
// router.patch('/certificateApproval/:id', adminAuthAuthenticated, expertController.certificateApproval)
module.exports= router;
