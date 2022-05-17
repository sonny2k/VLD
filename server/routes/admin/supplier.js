const express = require("express");
const router = express.Router();
const Supplier = require("../../models/Supplier");
const verifyToken = require("../../middleware/auth");

//GET ALL SUPPLIERS
router.get("/viewSupplier", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json(err);
  }
});

//CREATE SUPPLIER
router.post("/createSupplier", verifyToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newSup = new Supplier({
      name,
      description,
    });
    await newSup.save();
    res.json({
      success: true,
      message: "Bạn đã tạo nhà cung cấp thành công",
      newSup,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

//UPDATE SUPPLIER
router.put("/updateSupplier/:id", verifyToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    let updateSup = {
      name,
      description,
    };
    const SupupdateCondition = {
      _id: req.params.id,
    };
    upSup = await Supplier.findOneAndUpdate(SupupdateCondition, updateSup, {
      new: true,
    });
    if (!upSup)
      return res.status(400).json({
        success: false,
        message: "Không có quyền cập nhật nhà cung cấp",
      });
    res.json({
      success: true,
      message: "Bạn đã cập nhật nhà cung cấp thành công",
      supplier: upSup,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

//DELETE SUPPLIER
router.delete("/deleteSupplier/:id", verifyToken, async (req, res) => {
  try {
    deSup = await Supplier.findOneAndDelete({ _id: req.params.id });
    if (!deSup)
      return res
        .status(400)
        .json({ success: false, message: "Không có quyền xóa nhà cung cấp" });
    res.json({
      success: true,
      message: "Xóa nhà cung cấp thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/deleteSupplier", verifyToken, async (req, res) => {
  const { data } = req.body;
  try {
    Supplier.deleteMany({ _id: { $in: data } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );
    res.json({
      success: true,
      message: "Xóa nhà cung cấp thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

//SEACRH SUPPLIER
router.get("/searchSupplier/:name", verifyToken, async (req, res) => {
  try {
    var keywordSup = new RegExp(req.params.name, "i");
    console.log(`${keywordSup}`);
    const findName = await Supplier.find({ name: keywordSup });
    if (!keywordSup) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy nhà cung cấp" });
    }
    res.send(findName);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
  }
});
module.exports = router;
