const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticlecategorySchema = new Schema({
  name: String,
});

module.exports = mongoose.model("articlecategories", ArticlecategorySchema);
