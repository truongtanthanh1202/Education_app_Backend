const student = require("../model/User/Student/Student");
const { mulMongooseToObject } = require("../../util/mongoose");
const teacher = require("../model/User/Teacher/Teacher");
const fs = require("fs");
const { validationResult } = require("express-validator");
class SiteController {
  async index(req, res) {
    student
      .find({})
      .then((student) => {
        res.json(student);
      })
      .catch((error) => {
        console.log("failed!");
      });
  }

  async storeup(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.json(error);
    } else {
      if (req.body.title === "Student") {
        const Student = await student.findOne({ email: req.body.email });
        if (Student !== null) {
          res.json({ message: "Email existed. Please choose other one!" });
        } else {
          const data = req.body;
          data["avatar"] = {
            name: req.file.originalname,
            data: fs.readFileSync(req.file.path).toString("base64"),
            contentType: req.file.mimetype,
          };
          const user = new student(data);
          user.save().then(() => {
            res.render("me/signin");
          });
        }
      } else {
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
            res.render("me/signin");
          });
        }
      }
    }
  }

  createStudent(req, res) {
    res.render("students/signup");
  }

  createTeacher(req, res) {
    res.render("teachers/signup");
  }

  signin(req, res) {
    res.render("me/signin");
  }

  homePage(req, res) {
    res.render("home");
  }
}

module.exports = new SiteController();
