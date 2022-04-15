const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Prescription = require("../../models/Prescription");
const Consultation = require("../../models/Consultation");

router.get("/viewPrescription/:id", verifyToken, async (req, res) => {
  try {
    var populateQueryP = ({path:'medicines.product'});
    var populateQueryCD = ({path:'doctor', populate: {path:'account'}});
    var populateQueryCU = ({path:'user', populate: {path:'account'}});
    const docinfo = await Consultation.findOne({ _id: req.params.id }).populate(populateQueryCD);
    const userinfo = await Consultation.findOne({ _id: req.params.id }).populate(populateQueryCU);
    const prescription = await Prescription.findOne({ consultation: req.params.id }).populate(populateQueryP);
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