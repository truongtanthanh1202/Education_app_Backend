const teacher = require("../model/User/Teacher/Teacher");
const fs = require("fs");
const { validationResult } = require("express-validator");
const { mongooseToObject } = require("../../util/mongoose");
// const { mulMongooseToObject } = require("../../util/mongoose");
class TeacherController {
  store(req, res) {
    const data = req.body;
    const user = new teacher(data);
    user
      .save()
      .then(() => {
        res.json(req);
      })
      .catch((error) => {
        res.send(error);
      });
  }

  storeInfor(req, res, error) {
    teacher.findById(req.params.id).then((teacher) => {
      res.render("me/storeInfor", {
        user: mongooseToObject(teacher),
      });
    });
  }

  // [POST]when sign up
  async storeUp(req, res) {
    const error = validationResult(req);
    //[invalid character]
    if (!error.isEmpty()) {
      res.json(error);
    } else {
      //[Email already existed]

      const Teacher = await teacher.findOne({ email: req.body.email });
      if (Teacher !== null) {
        res.json({ meassage: "Email existed. Please choose other one!" });
      } else {
        const data = req.body;
        data["avatar"] = {
          name: req.file.originalname,
          data: fs.readFileSync(req.file.path).toString("base64"),
          contentType: req.file.mimetype,
        };
        const user = new teacher(data);
        user.save().then(() => {
          teacher
            .findOne({ email: req.body.email })
            .then((teacher) => {
              res.render("me/storeInfor", {
                user: mongooseToObject(teacher),
              });
            })
            .catch((error) => {
              res.send(error);
            });
        });
      }
    }
  }

  //[GET]
  MyHome(req, res) {
    teacher.findById(req.params.id).then((teacher) => {
      res.render("me/home", {
        user: mongooseToObject(teacher),
      });
    });
  }
}

module.exports = new TeacherController();
