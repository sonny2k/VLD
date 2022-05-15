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

router.get("/viewListArticle/detail/:id", async (req, res) => {
  try {
    const artListdetail = await Article.findOne({ _id: req.params.id })
      .populate("articlecategory")
      .populate("author");
    res.json(artListdetail);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/searchArticle/:title", async (req, res) => {
  try {
    var keywordArt = new RegExp(req.params.title, "i");
    console.log(`${keywordArt}`);
    const findTitle = await Article.find({ title: keywordArt, status: 1 });
    if (!keywordArt) {
      return res
        .status(400)
        .json({ success: false, message: "Không có tin tức cần tìm" });
    }
    res.send(findTitle);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
  }
});

module.exports = router;
