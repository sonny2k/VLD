const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductShema = new Schema({
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
  unit: {
    type: String,
  },
  components: {
    type: String,
  },
  origin: {
    type: String,
  },
});

module.exports = mongoose.model("products", ProductShema);
