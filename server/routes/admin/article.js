const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const ArticleCategories = require("../../models/ArticleCategory");
const Article = require("../../models/Article");
const { cloudinary } = require("../../utils/cloudinary");

router.get("/viewListArticle", async (req, res) => {
  try {
    const artList = await Article.find()
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

router.post("/createArticle", verifyToken, async (req, res) => {
  const {
    articlecategory,
    briefdescription,
    content,
    banner,
    title,
    status,
    createdat,
  } = req.body;

  try {
    const newArticle = new Article({
      articlecategory,
      author: req.accountId,
      briefdescription,
      content,
      banner,
      title,
      status,
      createdat,
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
    briefdescription,
    content,
    banner,
    title,
    status,
    updatedAt,
  } = req.body;

  try {
    let updateArt = {
      articlecategory,
      briefdescription,
      content,
      banner,
      title,
      status,
      updatedAt,
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

router.post("/publicArticle", verifyToken, async (req, res) => {
  const { id } = req.body;

  try {
    let updateArt = {
      status: 1,
      updatedAt = 
    };
    const ArtupdateCondition = {
      _id: id,
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

router.post("/hideArticle", verifyToken, async (req, res) => {
  const { id } = req.body;

  try {
    let updateArt = {
      status: 0,
    };
    const ArtupdateCondition = {
      _id: id,
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

// TÌm kiếm tin tức bằng GET
router.get("/searchArticle/:title", verifyToken, async (req, res) => {
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

//Tải ảnh theo id trên api
router.post("/banner/:id", verifyToken, async (req, res) => {
  try {
    const fileBanner = req.body.banner;
    const uploadRes = await cloudinary.uploader.upload(fileBanner);
    console.log(uploadRes.secure_url);
    try {
      let updatedArticle = {
        banner: uploadRes.secure_url,
      };

      const bannerupdatecondition = { _id: req.params.id };

      upAr = await Article.findOneAndUpdate(
        bannerupdatecondition,
        updatedArticle,
        { new: true }
      );
      if (!upAr)
        return res.status(400).json({
          success: false,
          message: "Người dùng không có quyền cập nhật tài khoản này",
        });
      res.json({
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        article: upAr,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Lỗi nội bộ" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại" });
  }
});

//Tải ảnh không có id trên api
router.post("/banner", verifyToken, async (req, res) => {
  const { dulieu } = req.body;
  const { _id } = dulieu;
  try {
    const fileBanner = dulieu.banner;
    const uploadRes = await cloudinary.uploader.upload(fileBanner);
    console.log(uploadRes.secure_url);
    try {
      let updatedArticle = {
        banner: uploadRes.secure_url,
      };

      const bannerupdatecondition = { _id: _id };

      upAr = await Article.findOneAndUpdate(
        bannerupdatecondition,
        updatedArticle,
        { new: true }
      );
      if (!upAr)
        return res.status(400).json({
          success: false,
          message: "Người dùng không có quyền cập nhật tài khoản này",
        });
      res.json({
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        article: upAr,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Lỗi nội bộ" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại" });
  }
});
//=====================================================
// Danh mục tin tức

//View all Article Category
router.get("/viewArticleCategory", async (req, res) => {
  try {
    const articleCategories = await ArticleCategories.find();
    res.status(200).json(articleCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Create Article Category
router.post("/createArticleCategory", async (req, res) => {
  const { name } = req.body;
  try {
    const newArtCate = new ArticleCategories({
      name,
    });
    await newArtCate.save();
    res.json({
      success: true,
      message: "Bạn đã tạo danh mục tin tức thành công",
      newArtCate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Update Article Category
router.put("/updateArticleCategory/:id", verifyToken, async (req, res) => {
  const { name } = req.body;
  try {
    let updateArtCate = {
      name,
    };
    const ArtCateupdateCondition = {
      _id: req.params.id,
    };
    upArtCate = await ArticleCategories.findOneAndUpdate(
      ArtCateupdateCondition,
      updateArtCate,
      {
        new: true,
      }
    );
    if (!upArtCate)
      return res.status(400).json({
        success: false,
        message: "Không có quyền cập nhật danh mục tin tức",
      });
    res.json({
      success: true,
      message: "Bạn đã cập nhật danh mục tin tức thành công",
      ProductCategory: upArtCate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Delete Article Category
router.post("/deleteArticleCategory", verifyToken, async (req, res) => {
  const { data } = req.body;
  try {
    ArticleCategories.deleteMany({ _id: { $in: data } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );
    res.json({
      success: true,
      message: "Xóa danh mục tin tức thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Delete Article
router.post("/deleteArticle", verifyToken, async (req, res) => {
  const { data } = req.body;
  try {
    Article.deleteMany({ _id: { $in: data } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );
    res.json({
      success: true,
      message: "Xóa tin tức thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;
