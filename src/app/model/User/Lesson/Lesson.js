const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

//mongoose.Schema.Types.ObjectId
const Lesson = new Schema({
    topic: {type: String},
    description: {type: String},
    id_teacher: {type: String},
    id_course: {type: String},
    thumbnail: {
        // name: String,
        // data: Buffer,
        // contentType: String,
        type: String,
    },
    video: {type: String},
    document: [
        {
            name: String,
            data: String,
        },
    ],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

mongoose.plugin(slug);
Lesson.plugin(mongooseDelete, {overrideMethods: 'all'});
module.exports = mongoose.model('Lesson', Lesson);
