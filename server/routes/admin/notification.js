const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Notification = require("../../models/Notification");

// //Tạo danh sách thông báo
// router.get("/notice", verifyToken, async (req, res) => {
//   try {
//     const noticeList = await Notification.find();
//     res.json({ noticeList });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Lỗi tải dữ liệu",
//     });
//   }
// });

// //Tạo thông báo
// router.post("/createNotice", verifyToken, async (req, res) => {
//   const { title, message, creator, recipient } = req.body;
//   try {
//     const newNotice = new Notification({
//       title,
//       message,
//       creator,
//       recipient,
//     });
//     await newNotice.save();
//     res.json({
//       success: true,
//       message: "Tạo thông báo thành công",
//       newNotice,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Lỗi tải dữ liệu",
//     });
//   }
// });

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
