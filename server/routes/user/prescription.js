const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Prescription = require("../../models/Prescription");

router.get("/viewPrescriptionByConsultation", verifyToken, async (req, res) => {
  const {
    id,
  } = req.body;
  try {
    var populateQuery = ({path:'medicines.product'});
    const prescription = await Prescription.findOne({ consultation: id }).populate(populateQuery);
    res.json(prescription);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;