const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const slug = require("mongoose-slug-generator");
const Schema = mongoose.Schema;

const avatar = new Schema({
  name: { type: String },
  desc: { type: String },
  img: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mongoose.plugin(slug);
avatar.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("Avatar", avatar);
