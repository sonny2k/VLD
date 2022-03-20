const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Department = require("../../models/Department");

router.get("/viewListDepartment", verifyToken, async (req, res) => {
  try {
    const depList = await Department.find();
    res.json({
      success: true,
      depList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/createDepartment", verifyToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newDep = new Department({
      name,
      description,
    });
    await newDep.save();
    res.json({
      success: true,
      message: "Bạn đã tạo chuyên khoa thành công",
      newDep,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updateDepartment/:id", verifyToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    let updateDep = {
      name,
      description,
    };
    const DepupdateCondition = {
      _id: req.params.id,
    };
    upDep = await Department.findOneAndUpdate(DepupdateCondition, updateDep, {
      new: true,
    });
    if (!upDep)
      return res.status(400).json({
        success: false,
        message: "Không có quyền cập nhật chuyên khoa",
      });
    res.json({
      success: true,
      message: "Bạn đã cập nhật chuyên khoa thành công",
      department: upDep,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.delete("/deleteDepartment/:id", verifyToken, async (req, res) => {
  try {
    deDep = await Department.findOneAndDelete({ _id: req.params.id });
    if (!deDep)
      return res
        .status(400)
        .json({ success: false, message: "Không có quyền xóa chuyên khoa" });
    res.json({
      success: true,
      message: "Xóa chuyên khoa thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/searchDepartment/:name", verifyToken, async (req, res) => {
  try {
    var keywordDep = new RegExp(req.params.name, "i");
    console.log(`${keywordDep}`);
    const findName = await Department.find({ name: keywordDep });
    if (!keywordDep) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy chuyên khoa" });
    }
    res.send(findName);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
  }
});

module.exports = router;
