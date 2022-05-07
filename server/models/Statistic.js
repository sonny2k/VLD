const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatisticSchema = new Schema({
  consultations: {
    type: String,
  },
  departments: {
    type: String,
  },
  symptoms: {
    type: String,
  },
});
module.exports = mongoose.model("statistics", StatisticSchema);
