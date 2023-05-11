const express = require('express');
const multer = require('../app/middlewares/multer/multer');
const validator = require('../app/middlewares/validator/validator');
const router = express.Router();

const TeacherController = require('../app/controller/Teachercontroller');
const {validate} = require('../app/model/User/Student/Student');
const Teachercontroller = require('../app/controller/Teachercontroller');
router.use('/myProfile', TeacherController.storeInfor);
router.use('/:id/MyProfile', TeacherController.storeInfor);
router.use('/MyProfile', TeacherController.storeInfor);
router.use('/:id/MyHome', TeacherController.MyHome);
router.post('/storeInfor', TeacherController.store);
router.use('/:id/create_course', TeacherController.renderCreation);
router.post(
    '/:id/myCourse',
    multer.single('thumbnail'),
    TeacherController.createCourse,
);
//[Real]
router.post('/createCourse', TeacherController.addCourse);
router.use('/MyCourses', TeacherController.MyCourses);
router.use('/:id/MyAllCourse', TeacherController.showCourse);
router.use(
    '/:id_teacher/:id_course/creat_lesson',
    TeacherController.renderCreatLesson,
);
//[Real]
router.post('/createLesson', TeacherController.addLesson);
router.use('/MyLessons', TeacherController.MyLessons);
router.post(
    '/:id_teacher/:id_course/myLesson',
    multer.any('document'),
    TeacherController.createLesson,
);
router.use('/:id_teacher/:id_course/MyAllLesson', TeacherController.showLesson);
router.use(
    '/:id_teacher/:id_course/:id_lesson/:topic/display',
    TeacherController.showDetailLesson,
);
router.use(
    '/:id_teacher/:id_course/delete_lesson',
    TeacherController.renderDeleteLesson,
);
router.delete(
    '/:id_teacher/:id_course/delete_lesson_real',
    TeacherController.softDeleteLesson,
);

router.use(
    '/:id_teacher/:id_course/:id_lesson/edit',
    Teachercontroller.renderEdit,
);

router.put(
    '/:id_teacher/:id_course/:id_lesson/editLesson',
    multer.any('document'),
    Teachercontroller.editLesson,
);

module.exports = router;
