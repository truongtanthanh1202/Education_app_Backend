const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const slug = require("mongoose-slug-generator");
const Schema = mongoose.Schema;

const Student = new Schema({
  title: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String },
  otp: { type: String },
  gender: { type: String },
  avatar: {
    name: String,
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mongoose.plugin(slug);
Student.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("Student", Student);
