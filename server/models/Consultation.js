const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConsultationSchema = new Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  status: {
    type: String,
  },
  symptom: {
    type: String,
  },
  date: {
    type: Date,
  },
  hour: {
    type: String,
  },
  ratingcontent: {
    type: String,
  },
  roomname: {
    type: String,
  },
  excuse: {
    type: String,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "doctors",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  ratingstarcontent: {
    type: Number,
  },
});

module.exports = mongoose.model("consultations", ConsultationSchema);
