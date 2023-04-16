const teacher = require("../model/User/Teacher/Teacher");
const { mulMongooseToObject } = require("../../util/mongoose");
class SiteController {
  title(req, res) {
    res.render("splash-screens/title");
  }
}

module.exports = new SiteController();
