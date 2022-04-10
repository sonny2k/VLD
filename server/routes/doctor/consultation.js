const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");

router.get("/viewlistconsult", verifyToken, async (req, res) => {
  try {
    var populateQuery = ({path:'user', populate: {path:'account'}});
    const doctor = await Doctor.findOne({ account: req.accountId });
    const doctorId = doctor._id;
    const allconsultlist = await Consultation.find({ doctor: doctorId }).populate(populateQuery);
    res.json(allconsultlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/viewconsult/:id", verifyToken, async (req, res) => {
  try {
    var populateQuery = ({path:'user', populate: {path:'account'}});
    const consultation = await Consultation.find({ _id: req.params.id }).populate(populateQuery);
    res.json(consultation);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/cancelconsult", verifyToken, async (req, res) => {
  const {
    _id,
    doctor,
    date,
    hour,
  } = req.body;

  const doctorraw = Doctor.findOne({ account: req.accountId });
  const doctorId = doctorraw._id;

  try {       
    const consultationupdatecondition = { doctor: doctorId, _id: _id};
    deleteConsultation = await Consultation.findOneAndDelete(
      consultationupdatecondition,
    );

    // User not authorized to update consultation
    if (!deleteConsultation)
      return res.status(400).json({
        success: false,
        message: "Người dùng không có quyền cập nhật tài khoản này",
      });

    Doctor.updateOne(
      { _id: doctor },
      { $set: { "availables.$[a].hours.$[b].status": false } },
      { arrayFilters: [ { "a.date": date } , { "b.time": hour } ] }
    ).then((result) => {
      console.log(result)
    }, (e) => {
      console.log(e)
    })  

    res.json({
      success: true,
      message: "Hủy lịch thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/confirmconsultation", verifyToken, async (req, res) => {
  const {
    _id,
  } = req.body;

  const doctorraw = Doctor.findOne({ account: req.accountId });
  const doctorId = doctorraw._id;

  try {       
    let updatedConsultation = {
      status: "chờ khám"
    };

    const consultationupdatecondition = { doctor: doctorId, _id: _id};
    updatedConsultation = await Consultation.findOneAndUpdate(
      consultationupdatecondition,
      updatedConsultation,
      { new: true }
    );

    // User not authorized to update consultation
    if (!updatedConsultation)
      return res.status(400).json({
        success: false,
        message: "Người dùng không có quyền cập nhật tài khoản này",
      });

    res.json({
      success: true,
      message: "Xác nhận buổi hẹn thành công",
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