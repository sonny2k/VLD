const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AvailableSchema = new Schema(
  {
    date: Date,
    hours: [
      {
        time: String,
        status: Boolean,
      },
    ],
  },
  { _id: false }
);

const RatingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "accounts" },
  content: String,
  star: Number,
  date: Date,
  status: Number,
});

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
  workcertificate: {
    type: String,
  },
  excellence: {
    type: String,
  },
  level: {
    type: String,
  },
  degree: {
    type: String,
  },
  workhistory: {
    type: String,
  },
  education: {
    type: String,
  },
  ratings: [RatingSchema],
  availables: [AvailableSchema],
  excellence: {
    type: String,
  },
  signature: {
    type: String,
  },
  status: {
    type: Number,
  },
});

module.exports = mongoose.model("doctors", DoctorSchema);
