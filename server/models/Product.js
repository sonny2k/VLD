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
    category: {
      type: String,
    },
    specdes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductShema);
