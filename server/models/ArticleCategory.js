const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleCategorySchema = new Schema({
  name: {
    type: String,
  },
});

module.exports = mongoose.model("articlecategories", ArticleCategorySchema);
