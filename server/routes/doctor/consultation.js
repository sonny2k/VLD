const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const Account = require("../../models/Account");
const fns = require('date-fns');

// Xem danh sách lịch hẹn của bác sĩ
router.get("/viewlistconsult", verifyToken, async (req, res) => {
  try {
    var populateQuery = { path: "user", populate: { path: "account" } };
    const doctor = await Doctor.findOne({ account: req.accountId });
    const doctorId = doctor._id;
    const allconsultlist = await Consultation.find({
      doctor: doctorId,
    }).populate(populateQuery);
    res.json(allconsultlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// Xem chi tiết lịch hẹn của bác sĩ
router.get("/viewconsult/:id", verifyToken, async (req, res) => {
  try {
    var populateQuery = { path: "user", populate: { path: "account" } };
    const consultation = await Consultation.find({
      _id: req.params.id,
    }).populate(populateQuery);
    res.json(consultation);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// Xác nhận lịch hẹn của bác sĩ
router.post("/confirmconsultation", verifyToken, async (req, res) => {
  const { _id } = req.body;

  const doctorraw = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctorraw._id;

  const consult = await Consultation.findOne({ _id: _id });
  const userId = consult.user;

  const consultdate = consult.date;
  const consulthour = consult.hour;

  try {
    let updatedConsultation = {
      status: "chờ khám",
    };

    const consultationupdatecondition = { doctor: doctorId, _id: _id };
    updatedConsult = await Consultation.findOneAndUpdate(
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

    var dateTime = Date.now();
    const newNotice = new Notification({
      title: "xác nhận đặt lịch",
      message: `buổi hẹn ngày ${fns.format(consultdate, "dd/MM/yyyy")} lúc ${consulthour} đã được xác nhận`,
      creator: doctorId,
      recipient: userId,
      notidate: dateTime,
      seen: false,
      type: "confirm",
      path: _id,
    });
    await newNotice.save();

    res.json({
      success: true,
      message: "Xác nhận buổi hẹn thành công",
      updatedConsult,
      newNotice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// Từ chối lịch hẹn của bác sĩ 
router.post("/cancelconsultation", verifyToken, async (req, res) => {
  const { _id, doctor, date, hour } = req.body;

  const doctorraw = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctorraw._id;

  const consult = await Consultation.findOne({ _id: _id });
  const userId = consult.user;

  try {
    let updatedConsultation = {
      status: "bị từ chối",
    };

    const consultationupdatecondition = { doctor: doctorId, _id: _id };
    updatedConsult = await Consultation.findOneAndUpdate(
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

    Doctor.updateOne(
      { _id: doctor },
      { $set: { "availables.$[a].hours.$[b].status": false } },
      { arrayFilters: [{ "a.date": date }, { "b.time": hour }] }
    ).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );

    var dateTime = Date.now();
    const newNotice = new Notification({
      title: "từ chối lịch hẹn",
      message: `buổi hẹn ngày ${fns.format(new Date(date), "dd/MM/yyyy")} lúc ${hour} đã bị từ chối`,
      creator: doctorId,
      recipient: userId,
      notidate: dateTime,
      seen: false,
      type: "canceldoc",
      path: _id,
    });
    await newNotice.save();

    res.json({
      success: true,
      message: "Từ chối buổi hẹn thành công",
      updatedConsult,
      newNotice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// Đánh dấu đã xem cho thông báo mà người dùng nhấp vào
router.post("/isSeen/:id", verifyToken, async (req, res) => {
  const { _id } = req.body;

  const doctor = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctor._id;

  try {
    let updatedNotification = {
      seen: true,
    };

    const notificationupdatecondition = { recipient: doctorId, _id: _id };
    updatedNotification = await Notification.findOneAndUpdate(
      notificationupdatecondition,
      updatedNotification,
      { new: true }
    );

    // User not authorized to update consultation
    if (!updatedNotification)
      return res.status(400).json({
        success: false,
        message: "Người dùng không có quyền cập nhật tài khoản này",
      });

    res.json({
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// Đánh dấu đã xem cho tất cả thông báo của người dùng
router.post("/isSeen", verifyToken, async (req, res) => {

  const doctor = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctor._id;

  try {
    let updatedNotification = {
      seen: true,
    };

    const notificationupdatecondition = { recipient: doctorId };
    updatedNotification = await Notification.updateMany(
      notificationupdatecondition,
      updatedNotification,
      { new: true }
    );

    // User not authorized to update consultation
    if (!updatedNotification)
      return res.status(400).json({
        success: false,
        message: "Người dùng không có quyền cập nhật tài khoản này",
      });

    res.json({
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// router.put("/updateConsultDoc/:id", verifyToken, async (req, res) => {
//   const { status } = req.body;
//   try {
//     const iddoctor = await Doctor.findOne({ account: req.accountId });
//     const doctorID = iddoctor._id;

//     let updatedConsult = {
//       status,
//     };

//     const consultupdatecondition = {
//       doctor: doctorID,
//       _id: req.params.id,
//     };
//     upConsult = await Consultation.findOneAndUpdate(
//       consultupdatecondition,
//       updatedConsult,
//       { new: true }
//     );
//     // User not authorized to update consultation
//     if (!upConsult)
//       return res.status(400).json({
//         success: false,
//         message: "Bác sĩ không có quyền cập nhật tài khoản này",
//       });

//     res.json({
//       success: true,
//       message: "Cập nhật trạng thái thành công",
//       doctor: upConsult,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: fale, message: "Lỗi tải dữ liệu" });
//   }
// });

module.exports = router;
