const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Consultation = require("../../models/Consultation");
const { db } = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");

router.get("/viewDocconsult", verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ account: req.accountId });
    const doctorID = doctor._id;
    var populateQuery = { path: "user" };
    const viewDocCon = await Consultation.find({ doctor: doctorID }).populate(
      populateQuery
    );
    res.json(viewDocCon);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updateConsultDoc/:id", verifyToken, async (req, res) => {
  const { doctor, status } = req.body;
  try {
    const iddoctor = await Doctor.findOne({ account: req.accountId });
    const doctorID = iddoctor._id;

    let updatedConsult = {
      status,
    };

    const consultupdatecondition = {
      doctor: doctorID,
      _id: req.params.id,
    };
    upConsult = await Consultation.findOneAndUpdate(
      consultupdatecondition,
      updatedConsult,
      { new: true }
    );
    // User not authorized to update consultation
    if (!upConsult)
      return res.status(400).json({
        success: false,
        message: "Bác sĩ không có quyền cập nhật tài khoản này",
      });

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      doctor: upConsult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: fale, message: "Lỗi tải dữ liệu" });
  }
});

module.exports = router;
