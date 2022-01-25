const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Consultations = require("../../models/Consultation");
const User = require("../../models/User");

// @route GET api/viewlistconsult
// @desc get consultaiton list
// @access private
router.get("/viewlistconsult", verifyToken, async (req, res) => {
  const allusers = await User.findOne({ account: req.accountId });
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

// @route GET api/viewlistconsultId
// @desc get consultaiton list by id
// @access private
router.get("/viewlistconsult/:id", verifyToken, async (req, res) => {
  const allusers = await User.findOne({ account: req.accountId });
  try {
    const allconsultlist = await Consultations.find({ status: req.params.id });
    if (allconsultlist.allusers != Consultations.User)
      return res.status(400).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    if (Consultations.status == 1)
      return res.json({ success: true, message: "Đang chờ xác nhận" });
    if (Consultations.status == 2)
      return res.json({ success: true, message: "Đã xác nhận" });
    if (Consultations.status == 3)
      return res.json({ success: true, message: "Đã hoàn thành" });
    if (Consultations.status == 4)
      return res.json({ success: true, message: "Đã hủy" });
    res.json({ success: true, allconsultlist });

    // if (Consultations.status == 1) {
    //   return res.json({
    //     success: true,
    //     message: "Đang chờ xác nhận",
    //     allconsultlist,
    //   });
    // } else if (Consultations.status == 2) {
    //   res.json({
    //     success: true,
    //     message: "Đã xác nhận",
    //     allconsultlist,
    //   });
    // } else if (Consultations.status == 3) {
    //   res.json({
    //     success: true,
    //     message: "Đã hoàn thành",
    //     allconsultlist,
    //   });
    // } else if (Consultations.status == 4) {
    //   res.json({
    //     success: true,
    //     message: "Đã hủy",
    //     allconsultlist,
    //   });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// @route POST api/createconsult
// @desc post consultation
// @access private
router.post("/createconsult", verifyToken, async (req, res) => {
  const { status, symptom, dateconsult, hour, roomname, doctor, user } =
    req.body;

  const date = new Date(dateconsult);

  try {
    const newConsult = new Consultations({
      status,
      symptom,
      date,
      hour,
      roomname,
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
