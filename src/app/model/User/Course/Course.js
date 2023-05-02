const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

//mongoose.Schema.Types.ObjectId
const Course = new Schema({
    description: {type: String},
    id_teacher: {type: String},
    lesson: [
        {
            id_lesson: {type: String},
        },
    ],
    thumbnail: {
        name: String,
        data: Buffer,
        contentType: String,
    },
    rating: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

mongoose.plugin(slug);
Course.plugin(mongooseDelete, {overrideMethods: 'all'});
module.exports = mongoose.model('Course', Course);
