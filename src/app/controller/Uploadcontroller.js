const avatar = require("../model/User/avatar/avatar");
const { mulMongooseToObject } = require("../../util/mongoose");
const fs = require("fs");
class UploadController {
  upload(req, res) {
    const file = req.file;
    if (!file) {
      res.json({ message: "failed" });
    }
    res.send(file);
  }

  show(req, res) {
    res.render("upload/photo");
  }
  // store image in db
  storedb(req, res) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString("base64");
    var finalImg = {
      name: req.file.filename,
      desc: req.file.destination,
      img: {
        data: img.toString("base64"),
        contentType: req.file.mimetype,
      },
    };
    avatar
      .create(finalImg)
      .then(() => {
        avatar
          .find({})
          .then((ava) => {
            res.render("me/avatar", { ava: mulMongooseToObject(ava) });
          })
          .catch((error) => {
            res.send(error);
          });
      })
      .catch((error) => {
        res.send(error);
      });
  }
}

module.exports = new UploadController();
