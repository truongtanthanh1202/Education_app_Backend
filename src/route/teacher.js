const express = require("express");
const multer = require("../app/middlewares/multer/multer");
const validator = require("../app/middlewares/validator/validator");
const router = express.Router();

const TeacherController = require("../app/controller/Teachercontroller");
const { validate } = require("../app/model/User/Student/Student");
router.use("/myProfile", TeacherController.storeInfor);
// router.post(
//   "/signup/MyProfile",
//   multer.single("myAvatar"),
//   validator.validatorSignup(),
//   TeacherController.storeUp
// );
router.use("/:id/MyProfile", TeacherController.storeInfor);
router.use("/MyProfile", TeacherController.storeInfor);
router.use("/:id/MyHome", TeacherController.MyHome);
router.post("/storeInfor", TeacherController.store);
module.exports = router;
