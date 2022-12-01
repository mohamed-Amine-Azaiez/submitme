const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const experienceSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  experience: { type: String },
});

module.exports = mongoose.model("Experience", experienceSchema);
