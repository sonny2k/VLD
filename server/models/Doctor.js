const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorShema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "departments",
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
  workcertificate: {
    type: String,
  },
  workhistory: {
    type: String,
  },
  rating: [
    {
      type: new mongoose.Schema({
        user: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        content: {
          type: String,
        },
        start: {
          type: String,
        },
        createdat: {
          type: String,
        },
      }),
    },
  ],
  availables: [
    {
      type: new mongoose.Schema({
        date: {
          type: Date,
        },
        hour: {
          type: String,
        },
      }),
    },
  ],
  signature: {
    type: String,
  },
});

module.exports = mongoose.model("doctors", DoctorShema);
