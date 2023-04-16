const mailer = require("../../util/mailer");
const { mongooseToObject } = require("../../util/mongoose");
const Student = require("../model/User/Student/Student");
const Teacher = require("../model/User/Teacher/Teacher");
class EmailController {
  async sendEmail(req, res) {
    try {
      const email = req.body.email;
      const student = await Student.findOne({ email: email });
      if (student === null) {
        const teacher = await Teacher.findOne({ email: email });
        if (teacher === null) {
          res.redirect("back");
        } else {
          let otp = [];
          for (let i = 0; i < 6; i++) {
            let code = Math.floor(Math.random() * 9);
            otp.push(code);
          }
          await mailer.sendMail(
            email,
            "Reset Password",
            `Your otp code is: ${otp.join("")}`
          );
          await Teacher.findOneAndUpdate(
            { email: email },
            { $set: { otp: otp.join("") } },
            { upsert: true }
          );
          res.render("login/verifyOTP", {
            user: mongooseToObject(teacher),
          });
        }
      } else {
        let otp = [];
        for (let i = 0; i < 6; i++) {
          let code = Math.floor(Math.random() * 9);
          otp.push(code);
        }
        await mailer.sendMail(
          email,
          "Reset Password",
          `Your otp code is: ${otp.join("")}`
        );
        const test = await Student.findOneAndUpdate(
          { email: email },
          { $set: { otp: otp.join("") } },
          { upsert: true }
        );
        res.render("login/verifyOTP", {
          user: mongooseToObject(student),
        });
      }
    } catch (error) {
      res.json(error);
    }
  }

  async sendOTP(req, res) {
    try {
      const email = req.body.email;
      const student = await Student.findOne({ email: email });
      if (student === null) {
        const teacher = await Teacher.findOne({ email: email });
        if (teacher === null) {
          res.json({ message: "Email do not exist!" });
        } else {
          let otp = [];
          for (let i = 0; i < 6; i++) {
            let code = Math.floor(Math.random() * 9);
            otp.push(code);
          }
          await mailer.sendMail(
            email,
            "Reset Password",
            `Your otp code is: ${otp.join("")}`
          );
          await Teacher.findOneAndUpdate(
            { email: email },
            { $set: { otp: otp.join("") } },
            { upsert: true }
          );
          res.json({
            message:
              "OTP code have already been sent to your email. Please check!",
          });
        }
      } else {
        let otp = [];
        for (let i = 0; i < 6; i++) {
          let code = Math.floor(Math.random() * 9);
          otp.push(code);
        }
        await mailer.sendMail(
          email,
          "Reset Password",
          `Your otp code is: ${otp.join("")}`
        );
        const test = await Student.findOneAndUpdate(
          { email: email },
          { $set: { otp: otp.join("") } },
          { upsert: true }
        );
        res.json({
          message:
            "OTP code have already been sent to your email. Please check!",
        });
      }
    } catch (error) {
      res.json(error);
    }
  }

  verifyOTP(req, res) {
    res.render("login/verifyOTP");
  }

  async checkOTP(req, res) {
    const student = await Student.findOne({
      email: req.params.slug,
      otp: req.body.otp.join(""),
    });
    if (student === null) {
      const teacher = await Teacher.findOne({
        email: req.params.slug,
        otp: req.body.otp.join(""),
      });
      if (teacher === null) {
        res.send("please fill again!");
      } else {
        res.render("login/resetPassword", {
          user: mongooseToObject(teacher),
        });
      }
    } else {
      res.render("login/resetPassword", {
        user: mongooseToObject(student),
      });
    }
  }

  async checkOTPofficial(req, res) {
    const student = await Student.findOne({
      email: req.body.email,
      otp: req.body.otp,
    });
    if (student === null) {
      const teacher = await Teacher.findOne({
        email: req.body.email,
        otp: req.body.otp,
      });
      if (teacher === null) {
        res.json({ message: 'OTP code is not correct!' });
      } else {
        res.json({ message: 'OTP code is correct!' });
      }
    } else {
      res.json({ message: 'OTP code is correct!' });
    }
  }
}
module.exports = new EmailController();
