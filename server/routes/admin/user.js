const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Account = require("../../models/Account");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const Consultation = require("../../models/Consultation");

router.get("/viewUser", verifyToken, async (req, res) => {
  try {
    const userList = await User.find().populate("account");
    res.json(userList);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Delete Any Doctor
router.post("/deleteUser", verifyToken, async (req, res) => {
  const { data, accdata } = req.body;
  try {
    User.deleteMany({ account: { $in: accdata } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );

    Account.deleteMany({ _id: { $in: accdata } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );

    Notification.deleteMany({ recipient: { $in: data } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );

    Notification.deleteMany({ creator: { $in: data } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );

    Consultation.deleteMany({ user: { $in: data } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );

    res.json({
      success: true,
      message: "Xóa người dùng thành công",
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
