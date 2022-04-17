const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Notification = require("../../models/Notification");

const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");
const User = require("../../models/User");

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
      title: "Đặt lịch thăm khám",
      message: name + " " + "đã gửi một yêu cầu đặt hẹn thăm khám",
      creator: userId,
      recipient: doctor,
      notidate: dateTime,
      seen: false,
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

router.post("/cancelconsult", verifyToken, async (req, res) => {
  const { _id, doctor, date, hour } = req.body;

  const user = await User.findOne({ account: req.accountId });
  const userId = user._id;

  // const status1 = await Consultation.findOne({ status: "chờ xác nhận" });
  // const status2 = await Consultation.findOne({ status: "chờ khám" });
  try {
    const consultationupdatecondition = {
      user: userId,
      _id: _id,
      status: ["chờ xác nhận", "chờ khám"],
    };
    const deleteConsultation = await Consultation.findOneAndDelete(
      consultationupdatecondition
    );
    // console.log(deleteConsultation);
    // User not authorized to update consultation
    if (!deleteConsultation)
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
      title: "Hủy đặt lịch",
      message: " người dùng đã hủy lịch hẹn",
      creator: userId,
      recipient: doctor,
      notidate: dateTime,
      seen: false,
    });
    await newNotice.save();

    res.json({
      success: true,
      message: "Hủy lịch thành công",
      deleteConsultation,
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

// router.delete("/cancelConsult/:id", verifyToken, async (req, res) => {
//   const userCancel = await User.findOne({ account: req.accountId });
//   const userIdd = userCancel._id;
//   try {
//     const cancelCon = await Consultation.findOneAndDelete({
//       user: userIdd,
//       _id: req.params.id,
//       status: ["chờ xác nhận","chờ khám"]
//     });
//     console.log(cancelCon);
//     if (!cancelCon)
//       return res
//         .status(400)
//         .json({ success: false, message: "Không có quyền hủy lịch" });

//     var dateTime = Date.now();
//     const newNotice = new Notification({
//       title: "Hủy đặt lịch",
//       message: " người dùng đã hủy lịch hẹn",
//       creator: userIdd,
//       recipient: "",
//       notidate: dateTime,
//     });
//     await newNotice.save();
//     res.json({
//       success: true,
//       message: "Hủy lịch hẹn thành công",
//       cancelCon,
//       newNotice,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Lỗi tải dữ liệu",
//     });
//   }
// });

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

module.exports = router;
