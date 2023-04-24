const teacher = require('../model/User/Teacher/Teacher');
const course = require('../model/User/Course/Course');
const lesson = require('../model/User/Lesson/Lesson');
const fs = require('fs');
const {validationResult} = require('express-validator');
const {mongooseToObject, mulMongooseToObject} = require('../../util/mongoose');
const mongoose = require('mongoose');
// const { mulMongooseToObject } = require("../../util/mongoose");
class TeacherController {
    store(req, res) {
        const data = req.body;
        const user = new teacher(data);
        user.save()
            .then(() => {
                res.json(req);
            })
            .catch(error => {
                res.send(error);
            });
    }

    storeInfor(req, res, error) {
        teacher.findById(req.params.id).then(teacher => {
            res.render('me/storeInfor', {
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

            const Teacher = await teacher.findOne({email: req.body.email});
            if (Teacher !== null) {
                res.json({meassage: 'Email existed. Please choose other one!'});
            } else {
                const data = req.body;
                data['avatar'] = {
                    name: req.file.originalname,
                    data: fs.readFileSync(req.file.path).toString('base64'),
                    contentType: req.file.mimetype,
                };
                const user = new teacher(data);
                user.save().then(() => {
                    teacher
                        .findOne({email: req.body.email})
                        .then(teacher => {
                            res.render('me/storeInfor', {
                                user: mongooseToObject(teacher),
                            });
                        })
                        .catch(error => {
                            res.send(error);
                        });
                });
            }
        }
    }

    //[GET]
    MyHome(req, res) {
        teacher.findById(req.params.id).then(teacher => {
            res.render('me/home', {
                user: mongooseToObject(teacher),
            });
        });
    }
    //[GET]
    async showCourse(req, res) {
        const mycourse = await course.find({id_teacher: req.params.id});
        res.render('teachers/showCourse', {
            course: mulMongooseToObject(mycourse),
        });
    }

    renderCreation(req, res) {
        res.render('teachers/newCourse', {
            user: {
                id: req.params.id,
            },
        });
    }
    createCourse(req, res) {
        const data = req.body;
        data['thumbnail'] = {
            name: req.file.originalname,
            data: fs.readFileSync(req.file.path).toString('base64'),
            contentType: req.file.mimetype,
        };
        data['lesson'] = [
            {
                id_lesson: req.body.id_lesson,
            },
        ];
        data['id_teacher'] = req.params.id;
        const newcourse = new course(data);
        newcourse.save().then(() => {
            course.findOne({description: req.body.description}).then(result => {
                res.render('teachers/newLesson', {
                    user: {
                        id_teacher: req.params.id,
                        id_course: result._id,
                    },
                });
            });
        });
    }

    createLesson(req, res) {
        const data = req.body;
        const docs = req.files;
        data['id_course'] = req.params.id_course;
        data['id_teacher'] = req.params.id_teacher;
        data['document'] = [];
        docs.map(result => {
            if (result.fieldname === 'thumbnail') {
                data['thumbnail'] = {
                    name: result.originalname,
                    data: fs.readFileSync(result.path).toString('base64'),
                    contentType: result.mimetype,
                };
            } else {
                data['document'].push({
                    name: result.originalname,
                    data: fs.readFileSync(result.path).toString('base64'),
                    contentType: result.mimetype,
                });
            }
        });
        const newLesson = new lesson(data);
        const file = data;
        newLesson.save().then(() => {
            //res.json({ message: "Lesson has been created successfully!" });
            res.render('teachers/newFile', {
                file: file,
            });
        });
    }
    async showLesson(req, res) {
        const mylesson = await lesson.find({id_course: req.params.id_course});
        res.render('teachers/showLesson', {
            lesson: mulMongooseToObject(mylesson),
        });
    }

    async showDetailLesson(req, res) {
        const mylesson = await lesson.findById(req.params.id_lesson);
        mylesson.video =
            mylesson.video.slice(0, 23) + '/embed' + mylesson.video.slice(23);
        mylesson.video = mylesson.video.replace('watch?v=', '');
        res.render('teachers/showParticularLesson', {
            lesson: mongooseToObject(mylesson),
        });
    }
}

module.exports = new TeacherController();
