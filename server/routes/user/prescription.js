const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Prescription = require("../../models/Prescription");

router.get("/viewListPrescription", verifyToken, async (req, res) => {
  try {
    const preList = await Prescription.find();
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

module.exports = router;
