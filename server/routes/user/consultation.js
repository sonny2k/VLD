const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const { db } = require("../../models/Consultation");

const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");

router.get("/viewlistconsult", verifyToken, async (req, res) => {
  try {
    var populateQuery = ({path:'doctor', populate: {path:'account'}});
    const allconsultlist = await Consultation.find({ user: req.accountId }).populate(populateQuery);
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
    var populateQuery = ({path:'doctor', populate: {path:'account'}});
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

router.post("/createconsult", verifyToken, async (req, res) => {
  const {
    name,
    phone,
    symptom,
    dateconsult,
    hour,
    doctor,
  } = req.body;

  const date = `${dateconsult}T00:00:00.000+00:00`;

  console.log(date)

  try {
    const newConsult = new Consultation({
      status: 'chờ xác nhận',
      name,
      phone,
      symptom,
      date,
      hour,
      doctor,
      user: req.accountId,
    });
    await newConsult.save();

    // let updatedavailability = {
    //   available: [{hour: [{status: true}]}]
    // };

    // const statusavail = { date: date, time: hour, _id: doctor };
    // updatedAccount = await Doctor.findOneAndUpdate(
    //   statusavail,
    //   updatedavailability,
    //   { new: true }
    // );

    // // User not authorized to update profile
    // if (!updatedavailability)
    //   return res.status(400).json({
    //     success: false,
    //     message: "Không thể đặt lịch, vui lòng thử lại",
    //   });

    Doctor.updateOne(
      { _id: doctor },
      { $set: { "availables.$[a].hours.$[b].status": true } },
      { arrayFilters: [ { "a.date": date } , { "b.time": hour } ] }
    ).then((result) => {
      console.log(result)
    }, (e) => {
      console.log(e)
    })

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

router.post("/cancelconsult", verifyToken, async (req, res) => {
  const {
    _id,
    doctor,
    date,
    hour,
  } = req.body;

  try {       
    const consultationupdatecondition = { user: req.accountId, _id: _id};
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

router.put("/consultsymptom", verifyToken, async (req, res) => {
  const {
    _id,
    symptom,
  } = req.body;

  try {
    let updatedConsultation = {
      symptom
    };

    const consultationupdatecondition = { user: req.accountId, _id: _id};
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
      message: "Thay đổi triệu chứng thành công",
      account: updatedConsultation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

module.exports = router;
