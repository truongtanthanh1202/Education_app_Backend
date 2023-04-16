const express = require("express");
const router = express.Router();

const EmailController = require("../app/controller/Emailcontroller");
router.post("/inputOTP", EmailController.sendEmail);
router.post("/:slug/ResetPassword", EmailController.checkOTP);
router.post("/checkOTP", EmailController.checkOTPofficial);
router.use("/verifyOTP", EmailController.verifyOTP);
router.post("/sendOTP", EmailController.sendOTP);
module.exports = router;
