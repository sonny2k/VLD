const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");
const Prescription = require("../../models/Prescription");

router.get("/viewListPreDoc", verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ account: req.accountId });
    const doctorID = doctor._id;
    const consultation = await Consultation.findOne({ doctorID });
    const conID = consultation._id;
    const preListDoc = await Prescription.find({
      consultation: conID,
    }).populate("consultation");
    res.json(preListDoc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;
