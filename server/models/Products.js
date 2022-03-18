const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProductShema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  categories: {
    type: Array,
  },
  
},
    {timestamps:true}
);

module.exports = mongoose.model("products",  ProductShema);
