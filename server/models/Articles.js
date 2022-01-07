const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleShema = new Schema({
  articlecategory: {
    type: Schema.Types.ObjectId,
    ref: "articleCategory",
  },
  author: {
    type: String,
  },
  briefdescription: {
    type: String,
  },
  content: {
    type: String,
  },
  banner: {
    type: String,
  },
  title: {
    type: String,
  },
  status: {
    type: Number,
  },
  createdat: {
    type: Date,
  },
  relevantarticles: {
    type: Schema.Types.ObjectId,
    ref: "articles",
  },
  dayofpublish: {
    type: Date,
  },
  hourofpublish: {
    type: Date,
  },
});

module.exports = mongoose.model("articles", ArticleShema);
