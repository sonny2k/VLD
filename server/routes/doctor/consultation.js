const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");

router.get("/viewlistconsult", verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.find({ account: req.accountId });
    const allconsultlist = await Consultation.find({ doctor: doctor._id });
    res.json(allconsultlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;