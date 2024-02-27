const multer = require("multer")
const aws = require('aws-sdk')
 const multerS3 = require('multer-s3')

 aws.config.update({
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: process.env.region,
});

var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dhanxpert-images',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
      console.log(file);
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
  limits: {fileSize:10000000}, // In bytes: 10 MB
});

module.exports = upload