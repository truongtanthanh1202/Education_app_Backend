const teacher = require('../model/User/Teacher/Teacher');
const course = require('../model/User/Course/Course');
const lesson = require('../model/User/Lesson/Lesson');
const fs = require('fs');
const {validationResult} = require('express-validator');
const {mongooseToObject, mulMongooseToObject} = require('../../util/mongoose');
const mongoose = require('mongoose');
// const { mulMongooseToObject } = require("../../util/mongoose");
class TeacherController {
    async store(req, res) {
        const allcourse = await course.find({});
        const data = {
            course: allcourse,
        };
        const user = new teacher(req.body);
        try {
            user.save();
            const userdata = teacher.findOne({email: req.body.email});
            data['user'] = userdata;
            res.json(data);
        } catch (error) {
            res.json(error);
        }
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
            teacher: {
                id: req.params.id,
                title: 'teacher',
            },
        });
    }

    renderCreation(req, res) {
        res.render('teachers/newCourse', {
            user: {
                id: req.params.id,
            },
        });
    }
    async createCourse(req, res) {
        const data = req.body;
        const parteacher = await teacher.findById(req.params.id);
        //[Rating]
        const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
        //[Thumbnail]
        const base64 = fs.readFileSync(req.file.path).toString('base64');
        data['thumbnail'] = `data:${req.file.mimetype};base64,${base64}`;
        //[lesson]
        data['lesson'] = [];
        data['id_teacher'] = req.params.id;
        data['rating'] = rating;
        data['nameOfteacher'] =
            parteacher.firstname + ' ' + parteacher.lastname;
        data['amountOfstudents'] = 0;
        const newcourse = new course(data);
        newcourse.save().then(async () => {
            const mycourse = await course.find({id_teacher: req.params.id});
            const parcourse = await course.findOne({
                description: data.description,
            });
            await teacher.updateOne(
                {_id: req.params.id},
                {
                    $push: {
                        course: {
                            id_course: parcourse._id.toString(),
                        },
                    },
                },
            );
            res.render('teachers/showCourse', {
                course: mulMongooseToObject(mycourse),
                teacher: {
                    id: req.params.id,
                },
            });
        });
    }

    renderCreatLesson(req, res) {
        res.render('teachers/newLesson', {
            teacher: {
                id_teacher: req.params.id_teacher,
                id_course: req.params.id_course,
            },
        });
    }

    createLesson(req, res) {
        const data = req.body;
        const docs = req.files;
        data['id_course'] = req.params.id_course;
        data['id_teacher'] = req.params.id_teacher;
        data['document'] = [];
        docs.map(result => {
            const base64 = fs.readFileSync(result.path).toString('base64');
            if (result.fieldname === 'thumbnail') {
                data['thumbnail'] = `data:${result.mimetype};base64,${base64}`;
            } else {
                data['document'].push({
                    name: result.originalname,
                    data: `data:${result.mimetype};base64,${base64}`,
                });
            }
        });
        const newLesson = new lesson(data);
        newLesson.save().then(async () => {
            //res.json({ message: "Lesson has been created successfully!" });
            const mylesson = await lesson.find({
                id_course: req.params.id_course,
            });
            const parlesson = await lesson.findOne({topic: data.topic});
            await course.updateOne(
                {_id: req.params.id_course},
                {
                    $push: {
                        lesson: {
                            id_lesson: parlesson._id.toString(),
                        },
                    },
                },
            );
            res.render('teachers/showLesson', {
                lesson: mulMongooseToObject(mylesson),
                course: {
                    id_course: req.params.id_course,
                    id_teacher: req.params.id_teacher,
                },
            });
        });
    }
    async showLesson(req, res) {
        const mylesson = await lesson.find({id_course: req.params.id_course});
        res.render('teachers/showLesson', {
            lesson: mulMongooseToObject(mylesson),
            course: {
                id_course: req.params.id_course,
                id_teacher: req.params.id_teacher,
            },
        });
    }

    async showDetailLesson(req, res) {
        const mylesson = await lesson.findById(req.params.id_lesson);
        mylesson.video =
            mylesson.video.slice(0, 23) + '/embed' + mylesson.video.slice(23);
        mylesson.video = mylesson.video.replace('watch?v=', '');
        if (mylesson.video.indexOf('&', 0) > 0) {
            mylesson.video = mylesson.video.replace(
                mylesson.video.slice(mylesson.video.indexOf('&', 0)),
                '',
            );
        }
        res.render('teachers/showParticularLesson', {
            lesson: mongooseToObject(mylesson),
        });
        // res.json(mylesson.video);
    }
    async renderDeleteLesson(req, res) {
        const mylesson = await lesson.find({id_course: req.params.id_course});
        res.render('teachers/showDeleteLesson', {
            lesson: mulMongooseToObject(mylesson),
            teacher: {
                id_teacher: req.params.id_teacher,
            },
            course: {
                id_course: req.params.id_course,
            },
        });
    }

    async softDeleteLesson(req, res) {
        try {
            await lesson.delete({_id: {$in: req.body.lesson_id}});
            res.redirect('back');
        } catch (error) {
            res.json(error);
        }
    }

    renderEdit(req, res) {
        res.render('teachers/editLesson', {
            lesson: {
                id_teacher: req.params.id_teacher,
                id_course: req.params.id_course,
                id_lesson: req.params.id_lesson,
            },
        });
    }

    async editLesson(req, res) {
        const data = req.body;
        const docs = req.files;
        data['id_course'] = req.params.id_course;
        data['id_teacher'] = req.params.id_teacher;
        data['document'] = [];
        docs.map(result => {
            const base64 = fs.readFileSync(result.path).toString('base64');
            if (result.fieldname === 'thumbnail') {
                data['thumbnail'] = `data:${result.mimetype};base64,${base64}`;
            } else {
                data['document'].push({
                    name: result.originalname,
                    data: `data:${result.mimetype};base64,${base64}`,
                });
            }
        });
        await lesson.updateOne({_id: req.params.id_lesson}, data);
        res.redirect(
            `/teacher/${data.id_teacher}/${data.id_course}/${req.params.id_lesson}/${data.topic}/display`,
        );
    }
}

module.exports = new TeacherController();