const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
  },
  bloodtype: {
    type: String,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  pastmedicalhistory: {
    type: String,
  },
  drughistory: {
    type: String,
  },
  familyhistory: {
    type: String,
  },
});

module.exports = mongoose.model("users", UserSchema);
