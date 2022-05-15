const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const ArticleCategories = require("../../models/ArticleCategory");
const Article = require("../../models/Article");

router.get("/viewListArticle", async (req, res) => {
  try {
    const artList = await Article.find({ status: 1 })
      .populate("articlecategory")
      .populate("author");
    res.json(artList);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;
