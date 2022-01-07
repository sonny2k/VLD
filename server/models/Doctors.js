const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorShema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "account",
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "departments",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  degree: {
    type: String,
  },
  description: {
    type: String,
  },
  education: {
    type: String,
  },
  educationplace: {
    type: String,
  },
  excellence: {
    type: String,
  },
  level: {
    type: String,
  },
  rating: {
    type: Array,
  },
  workcertificate: {
    type: String,
  },
  workhistory: {
    type: String,
  },
  availables: {
    type: Array,
  },
  content: {
    type: String,
  },
  createdat: {
    type: Date,
  },
  date: {
    type: Date,
  },
  hour: {
    type: String,
  },
  signature: {
    type: String,
  },
  star: {
    type: Number,
  },
});

module.exports = mongoose.model("doctors", DoctorShema);
