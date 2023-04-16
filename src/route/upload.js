const express = require("express");
const upload = require("../app/middlewares/multer/multer");
const router = express.Router();

const UploadController = require("../app/controller/Uploadcontroller");
router.post("/photo", upload.single("myFile"), UploadController.storedb);
router.use("/photos", UploadController.show);
module.exports = router;
