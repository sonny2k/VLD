const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
  },
  department: {
    type: String,
  },
  description: {
    type: String,
  },
  educationplace: {
    type: String,
  },
  degree: {
    type: String,
  },
  workcertificate: {
    type: String,
  },
  excellence: {
    type: String,
  },
  level: {
    type: String,
  },
  workhistory: {
    type: String,
  },
  education: {
    type: String,
  },
  ratings: new Schema({
    user: Schema.Types.ObjectId,
    content: String,
    star: Number,
    createdat: Date,
  }),
  availables: new Schema({
    date: Date,
    hour: new Schema({
      time: String,
      status: Boolean,
    }),
  }),
  signature: {
    type: String,
  },
});

module.exports = mongoose.model("doctors", DoctorSchema);
