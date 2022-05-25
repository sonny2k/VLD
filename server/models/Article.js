const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  articlecategory: {
    type: Schema.Types.ObjectId,
    ref: "articlecategories",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
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
  updatedat: {
    type: Date,
  },
  relevantarticles: [
    {
      type: Schema.Types.ObjectId,
      ref: "articles",
    },
  ],
});

module.exports = mongoose.model("articles", ArticleSchema);
