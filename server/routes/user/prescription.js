const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Prescription = require("../../models/Prescription");

router.get("/viewListPrescription", verifyToken, async (req, res) => {
  try {
    const preList = await Prescription.find().populate("consultation");
    res.json({
      success: true,
      preList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/createPrescription", verifyToken, async (req, res) => {
  const {
    consultation,
    pname,
    diagnosis,
    note,
    product,
    quantity,
    morningrate,
    noonrate,
    everate,
    specdes,
  } = req.body;

  try {
    const newPre = new Prescription({
      consultation,
      pname,
      diagnosis,
      note,
      medicines: { product, quantity, morningrate, noonrate, everate, specdes },
    });
    await newPre.save();

    res.json({
      success: true,
      message: "Bạn đã tạo toa thuốc thành công",
      newPre,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updatePrescription/:id", verifyToken, async (req, res) => {
  const {
    consultation,
    pname,
    diagnosis,
    note,
    product,
    quantity,
    morningrate,
    noonrate,
    everate,
    specdes,
  } = req.body;

  try {
    let updatePre = {
      consultation,
      pname,
      diagnosis,
      note,
      medicines: { product, quantity, morningrate, noonrate, everate, specdes },
    };
    const PreupdateCondition = {
      _id: req.params.id,
    };
    upPre = await Prescription.findOneAndUpdate(PreupdateCondition, updatePre, {
      new: true,
    });

    if (!upPre)
      return res
        .status(400)
        .json({ success: false, message: "Không có quyền cập nhật toa thuốc" });
    res.json({
      success: true,
      message: "Cập nhật toa thuốc thành công",
      prescription: upPre,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.delete("/deletePrescription/:id", verifyToken, async (req, res) => {
  try {
    dePre = await Prescription.findOneAndDelete({ _id: req.params.id });
    if (!dePre)
      return res
        .status(400)
        .json({ success: false, message: "Không có quyền xóa toa thuốc" });
    res.json({
      success: true,
      message: "Xóa toa thuốc thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/searchPrescription/:diagnosis", verifyToken, async (req, res) => {
  try {
    var keywordPre = new RegExp(req.params.diagnosis, "i");
    console.log(`${keywordPre}`);
    const findDiagnosis = await Prescription.find({ diagnosis: keywordPre });
    if (!keywordPre) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bác sĩ này" });
    }
    res.send(findDiagnosis);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
  }
});

module.exports = router;
