const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

//mongoose.Schema.Types.ObjectId
const student_course = new Schema({
    id_student: {type: String},
    courses: [
        {
            id_course: {type: String},
            lessons: [
                {
                    id_lesson: {type: String},
                    status: {type: Number},
                },
            ],
        },
    ],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

mongoose.plugin(slug);
student_course.plugin(mongooseDelete, {overrideMethods: 'all'});
module.exports = mongoose.model('student_course', student_course);
