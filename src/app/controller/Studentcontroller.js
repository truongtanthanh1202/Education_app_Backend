const fs = require('fs');
const course = require('../model/User/Course/Course');
const Lesson = require('../model/User/Lesson/Lesson');
const student = require('../model/User/Student/Student');
const student_course = require('../model/User/Student_Course/Student_Course');
const {mongooseToObject, mulMongooseToObject} = require('../../util/mongoose');
const {validationResult} = require('express-validator');
const {checkEmail} = require('./Teachercontroller');
const Teacher = require('../model/User/Teacher/Teacher');
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
        let validatation = false;
        const email_student = await student.find({email: req.body.email});
        const email_teacher = await Teacher.find({email: req.body.email});
        if (email_student.length === 0 && email_teacher.length === 0) {
            validatation = true;
        }
        let data = {};
        if (validatation) {
            const allcourse = await course.find({});
            data = {
                course: allcourse,
            };
            const user = new student(req.body);
            try {
                await user.save();
                const userdata = await student.findOne({email: req.body.email});
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

    //[GET]
    MyHome(req, res) {
        student.findById(req.params.id).then(student => {
            res.render('me/home', {
                user: mongooseToObject(student),
            });
        });
    }

    async showCourse(req, res) {
        const pupil = await student.findById(req.params.id);
        const id_course = [];
        pupil.course.map(result => {
            id_course.push(result.id_course);
        });
        const allcourse = mulMongooseToObject(
            await course.find({_id: {$in: id_course}}),
        );
        const newallcourse = allcourse.map(result => {
            return {...result, id_student: req.params.id};
        });
        res.render('students/showCourse', {
            course: newallcourse,
            student: {
                id: req.params.id,
            },
        });
    }

    async renderRegisterCourse(req, res) {
        const allcourse = mulMongooseToObject(await course.find({}));
        res.render('students/registerCourse', {
            course: allcourse,
            student: {
                id: req.params.id,
            },
        });
    }

    async registerCourse(req, res) {
        await student.updateOne(
            {_id: req.params.id},
            {
                $push: {
                    course: {
                        id_course: req.body.id_course,
                    },
                },
            },
        );
        await course.updateOne(
            {_id: req.body.id_course},
            {$inc: {amountOfstudents: 1}},
        );
        const alllesson = await Lesson.find({id_course: req.body.id_course});
        const lessons = [];
        alllesson.map(result => {
            lessons.push({
                id_lesson: result._id.toString(),
                status: 0,
            });
        });

        const data = {
            id_student: req.params.id,
            courses: [
                {
                    id_course: req.body.id_course,
                    lessons: lessons,
                },
            ],
        };
        const pupil = await student_course.findOne({
            id_student: req.params.id,
        });
        if (pupil === null) {
            const document = new student_course(data);
            await document.save();
        } else {
            await student_course.updateOne(
                {id_student: req.params.id},
                {
                    $push: {
                        courses: {
                            id_course: req.body.id_course,
                            lessons: lessons,
                        },
                    },
                },
            );
        }

        res.redirect(`/student/${req.params.id}/MyAllCourse`);
    }
    //[Real]
    async purchaseCourse(req, res) {
        //update course in student
        const mystudent = await student.findOneAndUpdate(
            {email: req.body.email},
            {
                $push: {
                    course: {
                        id_course: req.body.id_course,
                    },
                },
            },
        );
        // update the number Of members
        await course.updateOne(
            {_id: req.body.id_course},
            {$inc: {amountOfstudents: 1}},
        );

        const alllesson = await Lesson.find({id_course: req.body.id_course});
        const lessons = [];
        alllesson.map(result => {
            lessons.push({
                id_lesson: result._id.toString(),
                status: 0,
            });
        });

        const data = {
            id_student: mystudent._id.toString(),
            courses: [
                {
                    id_course: req.body.id_course,
                    lessons: lessons,
                },
            ],
        };
        const pupil = await student_course.findOne({
            id_student: mystudent._id.toString(),
        });
        if (pupil === null) {
            const document = new student_course(data);
            await document.save();
        } else {
            await student_course.updateOne(
                {id_student: mystudent._id.toString()},
                {
                    $push: {
                        courses: {
                            id_course: req.body.id_course,
                            lessons: lessons,
                        },
                    },
                },
            );
        }
        res.json({message: '200'});
    }

    async MyCourses(req, res) {
        const mycourses = await student.findOne({email: req.body.email});
        const id_course = [];
        mycourses.course.map(result => {
            id_course.push(result.id_course);
        });
        const allcourse = mulMongooseToObject(
            await course.find({_id: {$in: id_course}}),
        );
        res.json(allcourse);
    }

    async MyLessons(req, res) {
        const mylessons = mulMongooseToObject(
            await Lesson.find({id_course: req.body.id_course}),
        );

        const mystudent = await student.findOne({email: req.body.email});
        const pupil_course = await student_course.findOne({
            id_student: mystudent._id.toString(),
        });
        pupil_course.courses.map(result => {
            if (result.id_course === req.body.id_course) {
                result.lessons.map(lesson => {
                    for (let i = 0; i < mylessons.length; i++) {
                        if (mylessons[i]._id.toString() === lesson.id_lesson) {
                            mylessons[i].status = lesson.status;
                        }
                    }
                });
            }
        });
        res.json(mylessons);
    }

    async showParLesson(req, res) {
        const mystudent = await student.findOne({email: req.body.email});
        try {
            await student_course.updateOne(
                {
                    id_student: mystudent._id.toString(),
                },
                {
                    $set: {
                        'courses.$[course].lessons.$[lesson].status': 1,
                    },
                },
                {
                    arrayFilters: [
                        {
                            'course.id_course': req.body.id_course,
                        },
                        {
                            'lesson.id_lesson': req.body.id_lesson,
                        },
                    ],
                },
            );
            res.json({message: '200'});
        } catch (error) {
            res.json({message: '400'});
        }
    }

    async renderAllLesson(req, res) {
        const myalllesson = mulMongooseToObject(
            await Lesson.find({
                id_course: req.params.id_course,
            }),
        );

        let newAllLessons = myalllesson.map(result => {
            return {...result, id_student: req.params.id};
        });

        const pupil_course = await student_course.findOne({
            id_student: req.params.id,
        });

        pupil_course.courses.map(result => {
            if (result.id_course === req.params.id_course) {
                result.lessons.map(lesson => {
                    newAllLessons = newAllLessons.map(one => {
                        return {
                            ...one,
                            status: lesson.status === 1 ? true : false,
                        };
                    });
                });
            }
        });
        res.render('students/showAllLesson', {
            lesson: newAllLessons,
            student: {
                id_student: req.params.id,
            },
            course: {
                id_course: req.params.id_course,
            },
        });
    }

    async renderParLesson(req, res) {
        try {
            await student_course.updateOne(
                {
                    id_student: req.params.id,
                },
                {$set: {'courses.$[course].lessons.$[lesson].status': 1}},
                {
                    arrayFilters: [
                        {
                            'course.id_course': req.params.id_course,
                        },
                        {
                            'lesson.id_lesson': req.params.id_lesson,
                        },
                    ],
                },
            );
        } catch (error) {
            console.log(error);
        }

        const mylesson = await Lesson.findById(req.params.id_lesson);
        mylesson.video =
            mylesson.video.slice(0, 23) + '/embed' + mylesson.video.slice(23);
        mylesson.video = mylesson.video.replace('watch?v=', '');
        if (mylesson.video.indexOf('&', 0) > 0) {
            mylesson.video = mylesson.video.replace(
                mylesson.video.slice(mylesson.video.indexOf('&', 0)),
                '',
            );
        }
        res.render('students/showParLesson', {
            lesson: mongooseToObject(mylesson),
            student: {
                id_student: req.params.id,
                id_course: req.params.id_course,
            },
        });
    }
}

module.exports = new StudentController();
