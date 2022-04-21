const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Account = require("../../models/Account");

const Notification = require("../../models/Notification");
const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");
const User = require("../../models/User");

// Xem danh sách buổi hẹn của người dùng
router.get("/viewlistconsult", verifyToken, async (req, res) => {
  try {
    var populateQuery = { path: "doctor", populate: { path: "account" } };
    const user = await User.findOne({ account: req.accountId });
    const userId = user._id;
    const allconsultlist = await Consultation.find({ user: userId }).populate(
      populateQuery
    );
    res.json(allconsultlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// Xem chi tiết lịch hẹn của người dùng
router.get("/viewconsult/:id", verifyToken, async (req, res) => {
  try {
    var populateQuery = { path: "doctor", populate: { path: "account" } };
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

// Đặt lịch thăm khám của người dùng
router.post("/createconsult", verifyToken, async (req, res) => {
  const { name, phone, symptom, dateconsult, hour, doctor } = req.body;

  const date = `${dateconsult}T00:00:00.000+00:00`;

  const userne = await User.findOne({ account: req.accountId });
  const userId = userne._id;

  try {
    const newConsult = new Consultation({
      status: "chờ xác nhận",
      name,
      phone,
      symptom,
      date,
      hour,
      doctor,
      user: userId,
    });
    await newConsult.save();

    Doctor.updateOne(
      { _id: doctor },
      { $set: { "availables.$[a].hours.$[b].status": true } },
      { arrayFilters: [{ "a.date": date }, { "b.time": hour }] }
    ).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );
    if (!newConsult)
      return res.json({
        success: false,
        message: "Đăng ký lịch không thành công",
      });

    // var today = new Date();
    // var datee =
    //   today.getDate() +
    //   "-" +
    //   (today.getMonth() + 1) +
    //   "-" +
    //   today.getFullYear();
    // var timee =
    //   today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime = datee + " " + timee;

    var dateTime = Date.now();

    const newNotice = new Notification({
      title: "đặt lịch thăm khám",
      message: `đã đặt một lịch hẹn vào ngày ${format(newConsult.date, "dd/MM/yyyy")} lúc ${newConsult.hour}`,
      creator: userId,
      recipient: doctor,
      notidate: dateTime,
      seen: false,
      type: "createconsult",
      path: newConsult._id,
    });
    await newNotice.save();

    res.json({
      success: true,
      message: "Bạn đã đăng kí lịch thăm khám thành công",
      newConsult,
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

// Từ chối lịch hẹn của người dùng
router.post("/cancelconsult", verifyToken, async (req, res) => {
  const { _id, doctor, date, hour } = req.body;

  const user = await User.findOne({ account: req.accountId });
  const userId = user._id;

  try {
    let updatedConsultation = {
      status: "bị từ chối",
    };

    const consultationupdatecondition = { user: userId, _id: _id };
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
      message: `Buổi hẹn ngày ${format(date, "dd/MM/yyyy")} lúc ${hour} đã bị từ chối`,
      creator: doctorId,
      recipient: userId,
      notidate: dateTime,
      seen: false,
      type:"canceluser",
      path: _id,
    });
    await newNotice.save();

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

// Thay đổi triệu chứng trong lịch hẹn của người dùng 
router.put("/consultsymptom", verifyToken, async (req, res) => {
  const { _id, symptom } = req.body;

  try {
    let updatedConsultation = {
      symptom,
    };

    const consultationupdatecondition = { user: req.accountId, _id: _id };
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

// Đánh dấu đã xem cho thông báo mà người dùng nhấp vào
router.post("/isSeen/:id", verifyToken, async (req, res) => {
  const { _id } = req.body;

  const user = await User.findOne({ account: req.accountId });
  const userId = user._id;

  try {
    let updatedNotification = {
      seen: true,
    };

    const notificationupdatecondition = { recipient: userId, _id: _id };
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

  const user = await User.findOne({ account: req.accountId });
  const userId = user._id;

  try {
    let updatedNotification = {
      seen: true,
    };

    const notificationupdatecondition = { recipient: userId };
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


module.exports = router;
