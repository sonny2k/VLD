const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const verifyToken = require("../../middleware/auth");
const { cloudinary } = require("../../utils/cloudinary");

//CREATE
router.post("/createProduct", verifyToken, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET ALL PRODUCTS
router.get("/viewProduct", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/image/:id", verifyToken, async (req, res) => {
  try {
    const fileImage = req.body.image;
    const uploadResp = await cloudinary.uploader.upload(fileImage);
    console.log(uploadResp.secure_url);
    try {
      let updatedProduct = {
        image: uploadResp.secure_url,
      };

      const imageupdatecondition = { _id: req.params.id };

      upPr = await Product.findOneAndUpdate(
        imageupdatecondition,
        updatedProduct,
        { new: true }
      );
      if (!upPr)
        return res.status(400).json({
          success: false,
          message: "Người dùng không có quyền cập nhật tài khoản này",
        });
      res.json({
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        product: upPr,
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

module.exports = router;
