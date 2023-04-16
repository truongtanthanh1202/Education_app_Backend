const express = require("express");
const router = express.Router();

const SplashController = require("../app/controller/Splashcontroller");
router.use("/title", SplashController.title);
module.exports = router;
