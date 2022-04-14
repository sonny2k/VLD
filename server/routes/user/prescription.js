const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Consultation = require("../../models/Consultation");
const User = require("../../models/User");
const Prescription = require("../../models/Prescription");

router.get("/viewListPrescription", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ account: req.accountId });
    const userID = user._id;
    const consult = await Consultation.findOne({ userID });
    const consultID = consult._id;

    var popuQue = { path: "consultation", populate: { path: "user" } };

    const preListUser = await Prescription.find({
      consultation: consultID,
    }).populate(popuQue);
    res.json(preListUser);
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

router.get(
  "/viewListPrescription/detail/:id",
  verifyToken,
  async (req, res) => {
    const userr = await User.findOne({ account: req.accountId });
    const userIDD = userr._id;
    const consults = await Consultation.findOne({ userIDD });
    const consultIDD = consults._id;
    try {
      const preListdetail = await Prescription.findOne({
        consultation: consultIDD,
        _id: req.params.id,
      }).populate("consultation");
      res.json({
        preListdetail,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Lỗi tải dữ liệu",
      });
    }
  }
);

module.exports = router;
