const express = require('express');
const multer = require('../app/middlewares/multer/multer');
const validator = require('../app/middlewares/validator/validator');
const router = express.Router();

const TeacherController = require('../app/controller/Teachercontroller');
const {validate} = require('../app/model/User/Student/Student');
router.use('/myProfile', TeacherController.storeInfor);
// router.post(
//   "/signup/MyProfile",
//   multer.single("myAvatar"),
//   validator.validatorSignup(),
//   TeacherController.storeUp
// );
router.use('/:id/MyProfile', TeacherController.storeInfor);
router.use('/MyProfile', TeacherController.storeInfor);
router.use('/:id/MyHome', TeacherController.MyHome);
router.post('/storeInfor', TeacherController.store);
router.use('/:slug/:id/create_course', TeacherController.renderCreation);
router.post(
  '/:id/myCourse',
  multer.single('thumbnail'),
  TeacherController.createCourse,
);
router.use('/:id/MyAllCourse', TeacherController.showCourse);
router.post(
  '/:id_teacher/:id_course/myLesson',
  multer.any('document'),
  TeacherController.createLesson,
);
router.use('/:id_teacher/:id_course/MyAllLesson', TeacherController.showLesson);
router.use(
  '/:id_teacher/:id_course/:id_lesson/:topic',
  TeacherController.showDetailLesson,
);

module.exports = router;
