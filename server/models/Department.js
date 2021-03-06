const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("departments", DepartmentSchema);
