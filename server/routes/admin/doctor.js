const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Doctor = require("../../models/Doctor");

router.get("/viewDoctor", verifyToken, async (req, res) => {
  try {
    const doctorList = await Doctor.find().populate("account");
    res.json({ success: true, doctorList });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/createDoctor", verifyToken, async (req, res) => {
  const {
    account,
    department,
    description,
    educationplace,
    language,
    degree,
    workcertificate,
    excellence,
    level,
    workhistory,
    education,
    user,
    content,
    star,
    createdatRatings,
    dateAvailables,
    hour,
    signature,
  } = req.body;

  const createdat = new Date(createdatRatings);

  const date = new Date(dateAvailables);

  try {
    const newDoctor = new Doctor({
      account,
      department,
      description,
      educationplace,
      language,
      degree,
      workcertificate,
      excellence,
      level,
      workhistory,
      education,
      ratings: { user, content, star, createdat },
      availables: { date, hour },
      signature,
    });
    await newDoctor.save();
    res.json({
      success: true,
      message: "Tạo bác sĩ thành công",
      newDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updateDoctor/:id", verifyToken, async (req, res) => {
  const {
    account,
    department,
    description,
    educationplace,
    language,
    degree,
    workcertificate,
    excellence,
    level,
    workhistory,
    education,
    user,
    content,
    star,
    createdatRatings,
    dateAvailables,
    hour,
    signature,
  } = req.body;

  const createdat = new Date(createdatRatings);

  const date = new Date(dateAvailables);

  try {
    let updateDoc = {
      account,
      department,
      description,
      educationplace,
      language,
      degree,
      workcertificate,
      excellence,
      level,
      workhistory,
      education,
      ratings: { user, content, star, createdat },
      availables: { date, hour },
      signature,
    };
    const DocupdateCondition = {
      _id: req.params.id,
    };
    upDoc = await Doctor.findOneAndUpdate(DocupdateCondition, updateDoc, {
      new: true,
    });
    if (!upDoc)
      return res.status.json({
        success: false,
        message: "không có quyền cập nhật bác sĩ",
      });
    res.json({
      success: true,
      message: "Bạn đã cập nhật bác sĩ thành công",
      doctor: upDoc,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.delete("/deleteDoc/:id", verifyToken, async (req, res) => {
  try {
    deDoc = await Doctor.findOneAndDelete({ _id: req.params.id });
    if (!deDoc)
      return res.status(400).json({
        success: false,
        message: "Không có quyền xóa bác sĩ",
      });
    res.json({
      success: true,
      message: "Xóa bác sĩ thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/viewDoc/:id", verifyToken, async (req, res) => {
  try {
    const docListdetail = await Doctor.findOne({ _id: req.params.id });
    res.json({ success: true, docListdetail });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;
