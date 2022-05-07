const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Consultation = require("../../models/Consultation");

router.get("/consult", verifyToken, async (req, res) => {
  const getConsult = await Consultation.find();
  try {
    var flag_consutl = 0;
    for (var i = 0; i <= getConsult.length; i++) {
      flag_consutl++;
    }
    res.send(flag_consutl + " " + "buổi tư vấn");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/symptom", verifyToken, async (rea, res) => {
  try {
    var symptoms = { path: "symptom" };
    const getSymtom = await Consultation.findOne({
      symptom: "đau nhức xương khớp",
    }).populate(symptoms);
    var max = getSymtom[0];
    for (var i = 0; i <= getSymtom.length; i++) {
      if (max < getSymtom) {
        max = getSymtom[i];
        max += i;
      }
    }
    res.json(max);
    console.log(max);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;
