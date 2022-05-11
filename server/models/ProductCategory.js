const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductCategorySchema = new Schema({
  name: {
    type: String,
  },
});

module.exports = mongoose.model("productcategories", ProductCategorySchema);
