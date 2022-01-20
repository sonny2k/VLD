const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConsultationSchema = new Schema({
  status: {
    type: Number,
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
