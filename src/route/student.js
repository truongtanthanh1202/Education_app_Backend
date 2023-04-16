const express = require("express");
const router = express.Router();
const multer = require("../app/middlewares/multer/multer"); // [Multer] for upload image and store in db
const validator = require("../app/middlewares/validator/validator"); //[Validator] for check valid from sign up and sign in
const StudentController = require("../app/controller/Studentcontroller");
router.use("/myProfile", StudentController.storeInfor);
// router.post(
//   "/signup/MyProfile",
//   multer.single("myAvatar"),
//   validator.validatorSignup(),
//   StudentController.storeUp
// );
router.use("/:id/MyProfile", StudentController.storeInfor);
router.use("/MyProfile", StudentController.storeInfor);
router.use("/:id/MyHome", StudentController.MyHome);
router.post("/storeInfor", StudentController.store);
module.exports = router;
