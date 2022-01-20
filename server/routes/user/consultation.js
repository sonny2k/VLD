const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Consultations = require("../../models/Consultation");
const User = require("../../models/User");

router.get("/viewlistconsult", verifyToken, async (req, res) => {
  const allusers = await User.findOne({ account: req.accountId });
  //res.json({ success: true, allusers });
  try {
    const allconsultlist = await Consultations.find();
    if (allconsultlist.allusers != Consultations.User)
      return res.status(400).json({
        success: false,
        message: "Không có quyền truy cập",
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
    ratingcontent,
    roomname,
    doctor,
    user,
    ratingstarcontent,
  } = req.body;

  const date = new Date(dateconsult);

  try {
    const newConsult = new Consultations({
      status,
      symptom,
      date,
      hour,
      ratingcontent,
      roomname,
      doctor,
      user,
      ratingstarcontent,
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
