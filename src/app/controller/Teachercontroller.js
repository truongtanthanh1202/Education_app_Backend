const teacher = require('../model/User/Teacher/Teacher');
const course = require('../model/User/Course/Course');
const lesson = require('../model/User/Lesson/Lesson');
const student = require('../model/User/Student/Student');
const axios = require('axios');
const fs = require('fs');
const {validationResult} = require('express-validator');
const {mongooseToObject, mulMongooseToObject} = require('../../util/mongoose');
const mongoose = require('mongoose');
// const { mulMongooseToObject } = require("../../util/mongoose");
class TeacherController {
    async store(req, res) {
        let validatation = false;
        const email_student = await student.find({email: req.body.email});
        const email_teacher = await teacher.find({email: req.body.email});
        if (email_student.length === 0 && email_teacher.length === 0) {
            validatation = true;
        }
        let data = {};
        if (validatation) {
            const allcourse = await course.find({});
            data = {
                course: allcourse,
            };
            const user = new teacher(req.body);
            try {
                await user.save();
                const userdata = await teacher.findOne({email: req.body.email});
                if (userdata !== null) {
                    data['user'] = userdata;
                    data['message'] = '200';
                } else {
                    data['user'] = 'nothing';
                }
                res.json(data);
            } catch (error) {
                res.json(error);
            }
        } else {
            data = {
                message: '400',
            };
            res.json(data);
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
    //[Real]
    async addCourse(req, res) {
        const data = req.body;
        const myteacher = await teacher.findOne({email: req.body.email});
        const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
        data['amountOfstudents'] = Math.floor(
            Math.random() * (5500 - 2000) + 2000,
        );
        data['id_teacher'] = myteacher._id.toString();
        data['nameOfteacher'] = myteacher.firstname + ' ' + myteacher.lastname;
        data['rating'] = rating;
        data['lessons'] = [];
        const newcourse = new course(data);
        try {
            await newcourse.save();
            const mycourse = await course.findOne({name: req.body.name});
            await teacher.updateOne(
                {email: req.body.email},
                {
                    $push: {
                        course: {
                            id_course: mycourse._id.toString(),
                        },
                    },
                },
            );
            res.json({message: '200'});
        } catch (error) {
            res.json({message: '400'});
        }
    }

    async MyCourses(req, res) {
        const myteacher = await teacher.findOne({email: req.body.email});
        const mycourse = await course.find({
            id_teacher: myteacher._id.toString(),
        });
        res.json(mycourse);
    }

    async getTest(req, res) {
        res.json(req.query);
    }

    async testAxios(req, res) {
        const response = await axios.get(
            'http://localhost:4848/teacher/testGet',
            {
                params: {
                    id_course: '03448383',
                },
            },
        );
        res.json(response.data);
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
        data['lessons'] = [];
        data['id_teacher'] = req.params.id;
        data['rating'] = rating;
        parteacher.firstname + ' ' + parteacher.lastname;
        data['amountOfstudents'] = Math.floor(
            Math.random() * (5500 - 2000) + 2000,
        );
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
    //[Real]
    async addLesson(req, res) {
        const data = req.body;
        const mycourse = await course.findOne({_id: req.body.id_course});
        data['id_teacher'] = mycourse.id_teacher;
        const newLesson = new lesson(data);
        try {
            await newLesson.save();
            const parlesson = await lesson.findOne({topic: req.body.topic});
            await course.updateOne(
                {_id: req.body.id_course},
                {
                    $push: {
                        lessons: [
                            {
                                id_lesson: parlesson._id.toString(),
                            },
                        ],
                    },
                },
            );
            res.json({message: '200'});
        } catch (error) {
            res.json({messsage: '400'});
        }
    }

    async MyLessons(req, res) {
        const mylessons = await lesson.find({id_course: req.body.id_course});
        res.json(mylessons);
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
