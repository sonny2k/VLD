const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const ProductCategory = require("../../models/ProductCategory");
const verifyToken = require("../../middleware/auth");
const { cloudinary } = require("../../utils/cloudinary");

//CREATE
router.post("/createProduct", verifyToken, async (req, res) => {
  const { title, description, category, specdes, unit, components, origin } =
    req.body;
  try {
    const newProduct = new Product({
      title,
      description,
      category,
      specdes,
      unit,
      components,
      origin,
    });
    await newProduct.save();
    res.json({
      success: true,
      message: "Tạo sản phẩm thuốc thành công",
      newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});
// router.post("/createProduct", verifyToken, async (req, res) => {
//   const newProduct = new Product(req.body);

//   try {
//     const savedProduct = await newProduct.save();
//     res.status(200).json(savedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
//UPDATE
router.put("/updateProduct/:id", verifyToken, async (req, res) => {
  const { title, description, category, specdes, unit, components, origin } =
    req.body;
  try {
    let updatePro = {
      title,
      description,
      category,
      specdes,
      unit,
      components,
      origin,
    };
    const ProupdateCondition = {
      _id: req.params.id,
    };
    upPro = await Product.findOneAndUpdate(ProupdateCondition, updatePro, {
      new: true,
    });
    if (!upPro)
      return res.status(400).json({
        success: false,
        message: "Không có quyền cập nhật sản phẩm thuốc",
      });
    res.json({
      success: true,
      message: "Bạn đã cập nhật sản phẩm thuốc thành công",
      product: upPro,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});
// router.put("/:id", verifyToken, async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//DELETE
router.delete("/deleteProduct/:id", verifyToken, async (req, res) => {
  try {
    dePro = await Product.findOneAndDelete({ _id: req.params.id });
    if (!dePro)
      return res
        .status(400)
        .json({ success: false, message: "Không có quyền xóa sản phẩm thuốc" });
    res.json({
      success: true,
      message: "Xóa sản phẩm thuốc thành công",
    });
  } catch (err) {
    onsole.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.status(200).json("Product has been deleted...");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
//SEACRH PRODUCT
router.get("/searchProduct/:title", async (req, res) => {
  try {
    const keywordPro = new RegExp(req.params.title, "i");
    console.log(`${keywordPro}`);
    const findTitle = await Product.find({ title: keywordPro });
    if (!keywordPro) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy thuốc" });
    }
    res.send(findTitle);
  } catch (err) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
  }
});
// router.get("/find/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//GET ALL PRODUCTS
router.get("/viewProduct", async (req, res) => {
  try {
    const proList = await Product.find();
    res.status(200).json(proList);
  } catch (err) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});
// router.get("/viewProduct", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//UPDATE PRODUCT IMAGE
router.post("/image/:id", verifyToken, async (req, res) => {
  try {
    const fileImage = req.body.pic;
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

//UPDATE PRODUCT IMAGE
router.post("/image", verifyToken, async (req, res) => {
  try {
    const fileImage = req.body.pic;
    const uploadResp = await cloudinary.uploader.upload(fileImage);
    const resp = uploadResp.secure_url;
    res.json({
      resp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại" });
  }
});

// GET ALL PRODUCT CATEGORIES
router.get("/viewProductCategory", async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.status(200).json(productCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/createProductCategory", async (req, res) => {
  const { name } = req.body;
  try {
    const newProCate = new ProductCategory({
      name,
    });
    await newProCate.save();
    res.json({
      success: true,
      message: "Bạn đã tạo danh mục sản phẩm thuốc thành công",
      newProCate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updateProductCategory/:id", verifyToken, async (req, res) => {
  const { name } = req.body;
  try {
    let updateProCate = {
      name,
    };
    const ProCateupdateCondition = {
      _id: req.params.id,
    };
    upProCate = await ProductCategory.findOneAndUpdate(
      ProCateupdateCondition,
      updateProCate,
      {
        new: true,
      }
    );
    if (!upProCate)
      return res.status(400).json({
        success: false,
        message: "Không có quyền cập nhật danh mục sản phẩm thuốc",
      });
    res.json({
      success: true,
      message: "Bạn đã cập nhật danh mục sản phẩm thuốc thành công",
      ProductCategory: upProCate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.delete("/deleteProductCategory/:id", verifyToken, async (req, res) => {
  try {
    deProCate = await ProductCategory.findOneAndDelete({ _id: req.params.id });
    if (!deProCate)
      return res.status(400).json({
        success: false,
        message: "Không có quyền xóa danh mục sản phẩm thuốc",
      });
    res.json({
      success: true,
      message: "Xóa danh mục sản phẩm thuốc thành công",
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
