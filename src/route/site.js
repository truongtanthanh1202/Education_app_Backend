const express = require("express");
const router = express.Router();
const multer = require("../app/middlewares/multer/multer"); // [Multer] for upload image and store in db
const validator = require("../app/middlewares/validator/validator"); //[Validator] for check valid from sign up and sign in
const siteController = require("../app/controller/Sitecontroller");
router.use("/students/signup", siteController.createStudent);
router.use("/teachers/signup", siteController.createTeacher);
router.use("/user/signin", siteController.signin);
router.post(
  "/user/signin_after_signup",
  multer.single("myAvatar"),
  validator.validatorSignup(),
  siteController.storeup
);
router.use("/", siteController.homePage);
module.exports = router;
