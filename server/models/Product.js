const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductShema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    categories: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductShema);
