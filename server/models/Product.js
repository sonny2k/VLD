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
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    category: {
      type: String,
    },
    specdes: {
      type: String,
    },
    unit: {
      type: String,
    },
    components: {
      type: String,
    },
    origin: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductShema);
