const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Prescription = require("../../models/Prescription");
const Consultation = require("../../models/Consultation");

router.get("/viewPrescriptionByConsultation", verifyToken, async (req, res) => {
  const {
    id,
  } = req.body;
  try {
    var populateQueryP = ({path:'medicines.product'});
    var populateQueryCD = ({path:'doctor', populate: {path:'account'}});
    var populateQueryCU = ({path:'user', populate: {path:'account'}});
    const docinfo = await Consultation.find({ _id: id }).populate(populateQueryCD);
    const userinfo = await Consultation.find({ _id: id }).populate(populateQueryCU);
    const prescription = await Prescription.findOne({ consultation: id }).populate(populateQueryP);
    res.json({prescription, docinfo, userinfo});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;