const fs = require('fs');
const course = require('../model/User/Course/Course');
const student = require('../model/User/Student/Student');
const {mongooseToObject} = require('../../util/mongoose');
const {validationResult} = require('express-validator');
const {checkEmail} = require('./Teachercontroller');
class StudentController {
    //[GET]
    storeInfor(req, res, error) {
        student.findById(req.params.id).then(student => {
            res.render('me/storeInfor', {
                user: mongooseToObject(student),
            });
        });
    }

    async store(req, res) {
        const allcourse = await course.find({});
        const data = {
            course: allcourse,
        };
        const user = new student(req.body);
        try {
            user.save();
            const userdata = student.findOne({email: req.body.email});
            data['user'] = userdata;
            res.json(data);
        } catch (error) {
            res.json(error);
        }
    }

    // [POST]when sign up
    async storeUp(req, res) {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.json(error);
        } else {
            const Student = await student.findOne({email: req.body.email});
            if (Student !== null) {
                res.json({message: 'Email existed. Please choose other one!'});
            } else {
                const data = req.body;
                data['avatar'] = {
                    name: req.file.originalname,
                    data: fs.readFileSync(req.file.path).toString('base64'),
                    contentType: req.file.mimetype,
                };
                const user = new student(data);
                user.save().then(() => {
                    student
                        .findOne({email: req.body.email})
                        .then(student => {
                            res.render('me/storeInfor', {
                                user: mongooseToObject(student),
                            });
                        })
                        .catch(error => {
                            res.send(error);
                        });
                });
            }
        }
    }

    //[check Email and Password]
    // static checkEmail(req) {
    //   student.findOne({ email: req.body.email }).then((student) => {
    //     if (student !== null) {
    //       StudentController.checkemail = true;
    //     }
    //   });
    // }

    //[GET]
    MyHome(req, res) {
        student.findById(req.params.id).then(student => {
            res.render('me/home', {
                user: mongooseToObject(student),
            });
        });
    }
}

module.exports = new StudentController();
