const express = require("express");
const Mecontroller = require("../app/controller/Mecontroller");
const router = express.Router();
const MeController = require("../app/controller/Mecontroller");
const validator = require("../app/middlewares/validator/validator");
// router.use("/myProfile", MeController.storeInfor);
router.use("/:slug/:id/MyProfile", MeController.storeInfor);
router.use("/:slug/:id/MyHome", MeController.MyHome);
router.post("/:slug/:id/ResetPasswordHome", MeController.resetPasswordHome);
router.post("/resetPassword", MeController.resetPassword);
router.post(
  "/signin/MyProfile",
  validator.validatorLogin(),
  MeController.storeIn
);
router.post("/logintest", MeController.storeTest);
router.use("/total", Mecontroller.show);
module.exports = router;
