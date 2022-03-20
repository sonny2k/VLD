const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Article = require("../../models/Article");

router.get("/viewListArticle", verifyToken, async (req, res) => {
  try {
    const artList = await Article.find();
    res.json({ success: true, artList });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/createArticle", verifyToken, async (req, res) => {
  const {
    articlecategory,
    author,
    briefdescription,
    content,
    banner,
    title,
    status,
    datecreate,
    relevantarticles,
    publish,
    hourofpublish,
  } = req.body;

  const createdat = new Date(datecreate);

  const dayofpublish = new Date(publish);

  try {
    const newArticle = new Article({
      articlecategory,
      author,
      briefdescription,
      content,
      banner,
      title,
      status,
      createdat,
      relevantarticles,
      dayofpublish,
      hourofpublish,
    });
    await newArticle.save();

    res.json({
      success: true,
      message: "Tạo tin tức thành công",
      newArticle,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updateArticle/:id", verifyToken, async (req, res) => {
  const {
    articlecategory,
    author,
    briefdescription,
    content,
    banner,
    title,
    status,
    datecreate,
    relevantarticles,
    publish,
    hourofpublish,
  } = req.body;
  const createdat = new Date(datecreate);

  const dayofpublish = new Date(publish);
  try {
    let updateArt = {
      articlecategory,
      author,
      briefdescription,
      content,
      banner,
      title,
      status,
      createdat,
      relevantarticles,
      dayofpublish,
      hourofpublish,
    };
    const ArtupdateCondition = {
      _id: req.params.id,
    };
    upArt = await Article.findOneAndUpdate(ArtupdateCondition, updateArt, {
      new: true,
    });
    if (!upArt)
      return res.status.json({
        success: false,
        message: "Không có quyền cập nhật tin tức",
      });
    res.json({
      success: true,
      message: "Bạn đã cập nhật tin tức thành công",
      article: upArt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.delete("/deleteArticle/:id", verifyToken, async (req, res) => {
  try {
    deArt = await Article.findOneAndDelete({ _id: req.params.id });
    if (!deArt)
      return res
        .status(400)
        .json({ success: false, message: "Không có quyền xóa tin tức" });
    res.json({
      success: true,
      message: "Xóa bài viết thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/searchArticle/:title", verifyToken, async (req, res) => {
  try {
    var keywordArt = new RegExp(req.params.title, "i");
    console.log(`${keywordArt}`);
    const findTitle = await Article.find({ title: keywordArt });
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

router.get("/viewListArticle/detail/:id", verifyToken, async (req, res) => {
  try {
    const artListdetail = await Article.findOne({ _id: req.params.id });
    res.json({ success: true, artListdetail });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;
