const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "doctors",
  },
  notidate: {
    type: Date,
  },
  seen: {
    type: Boolean,
  },
  path: {
    type: String,
  },
});
module.exports = mongoose.model("notifications", NotificationSchema);
