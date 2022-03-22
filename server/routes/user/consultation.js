const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");

router.get("/viewlistconsult", verifyToken, async (req, res) => {
  try {
    var populateQuery = ({path:'doctor', populate: {path:'account'}});
    const allconsultlist = await Consultation.find(req._id).populate(populateQuery);
    
    if (allconsultlist.user != req._id)
    return res.status(400).json({
      success: false,
      message: "Người dùng không có quyền truy cập profile này",
    });
    res.json({ success: true, allconsultlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/createconsult", verifyToken, async (req, res) => {
  const {
    status,
    symptom,
    dateconsult,
    hour,
    doctor,
    user,
  } = req.body;

  const date = new Date(dateconsult);

  try {
    const newConsult = new Consultations({
      status,
      symptom,
      date,
      hour,
      doctor,
      user,
    });
    await newConsult.save();

    res.json({
      success: true,
      message: "Bạn đã đăng kí lịch thăm khám thành công",
      newConsult,
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
