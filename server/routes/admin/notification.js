const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const Doctor = require("../../models/Doctor");

//Xem danh sách thông báo của người dùng
router.get("/notice/user", verifyToken, async (req, res) => {
  var populateQuery = {
    path: "creator",
    model: Doctor,
    populate: { path: "account" },
  };
  const userne = await User.findOne({ account: req.accountId });
  const userId = userne._id;
  try {
    const noticeUserList = await Notification.find({
      recipient: userId,
    }).populate(populateQuery);
    res.json(noticeUserList);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Xem danh sách chi tiết của người dùng
router.get("/notice/user/detail", verifyToken, async (req, res) => {
  const userne = await User.findOne({ user: req.accountId });
  const userId = userne._id;
  try {
    const detailNoticeUserList = await Notification.findOne({
      userId,
      _id: req.params.id,
    });
    res.json({ detailNoticeUserList });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Xem danh sách thông báo của bác sĩ
router.get("/notice/doctor", verifyToken, async (req, res) => {
  var populateQuery = {
    path: "creator",
    model: User,
    populate: { path: "account" },
  };
  const doctorne = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctorne._id;
  try {
    const noticeDoctorList = await Notification.find({
      recipient: doctorId,
    }).populate(populateQuery);
    res.json(noticeDoctorList);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Xem danh sách chi tiết của bác sĩ
router.get("/notice/doctor/detail", verifyToken, async (req, res) => {
  const doctors = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctors._id;
  try {
    const noticeUserList = await Notification.findOne({
      creator: doctorId,
      _id: req.params.id,
    });
    res.json({ noticeUserList });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Chuyển sang đã đọc thông báo
router.post("/notice/user/seen", verifyToken, async (req, res) => {
  const userne = await User.findOne({ user: req.accountId });
  const userId = userne._id;
  const { _id } = req.body;
  try {
    let seenNotice = {
      seen: true,
    };
    const condition = { creator: userId, _id: _id };
    const seen = await Notification.findOneAndUpdate(condition, seenNotice, {
      new: true,
    });
    if (!seen)
      res.json({
        success: false,
        message: "Người dùng không thể đánh dấu là đã đọc thông báo",
      });
    res.json({
      success: true,
      message: "Đã xem tin nhắn!",
      seen,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/notice/doctor/seen", verifyToken, async (req, res) => {
  const doctors = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctors._id;
  const { _id } = req.body;
  try {
    let noticeSeen = {
      seen: true,
    };
    const conditions = { creator: doctorId, _id: _id };
    const seen = await Notification.findOneAndUpdate(conditions, noticeSeen, {
      new: true,
    });
    if (!seen)
      res.json({
        success: false,
        message: "Bác sĩ không thể đánh dấu là đã đọc thông báo",
      });
    res.json({
      success: true,
      message: "Đã xem tin nhắn!",
      seen,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/deleteNotification", verifyToken, async (req, res) => {
  const { data } = req.body;
  try {
    Notification.deleteMany({ _id: { $in: data } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );
    res.json({
      success: true,
      message: "Xóa thông báo thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

// router.put("/updateNotice/:id", verifyToken, async (req, res) => {
//   const { title, message, creator, recipient } = req.body;
//   try {
//     let updateNote = {
//       title,
//       message,
//       creator,
//       recipient,
//     };
//     const NoteupdateCondition = {
//       _id: req.params.id,
//     };
//     upNote = await Notification.findOneAndUpdate(
//       NoteupdateCondition,
//       updateNote,
//       { new: true }
//     );
//     if (!upNote)
//       return res.status.json({
//         success: false,
//         message: "Không có quyền cập nhật thông báo",
//       });
//     res.json({
//       success: true,
//       message: "Bạn đã cập nhật thông báo thành công",
//       notification: upNote,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Lỗi tải dữ liệu",
//     });
//   }
// });

// router.delete("/deleteNotice/:id", verifyToken, async (req, res) => {
//   try {
//     deNote = await Notification.findOneAndDelete({ _id: req.params.id });
//     if (!deNote)
//       return res
//         .status(400)
//         .json({ success: false, message: "Không có quyền xóa thông báo này" });
//     res.json({ success: true, message: "Xóa thông báo thành công" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Lỗi tải dữ liệu",
//     });
//   }
// });

// router.get("/searchNotice/:title", verifyToken, async (req, res) => {
//   try {
//     var keywordNote = new RegExp(req.params.title, "i");
//     console.log(`${keywordNote}`);
//     const findNote = await Notification.find({ title: keywordNote });
//     if (!keywordNote)
//       return res
//         .status(400)
//         .json({ success: false, message: "Không có thông báo nào cần tìm" });
//     res.send(findNote);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
//   }
// });

// router.get("/viewListNotice/detail/:id", verifyToken, async (req, res) => {
//   try {
//     const noteListdetail = await Notification.findOne({ _id: req.params.id });
//     res.json({ success: true, noteListdetail });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Lỗi tải dữ liệu",
//     });
//   }
// });
module.exports = router;
