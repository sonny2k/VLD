const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const argon2 = require("argon2");

const User = require("../../models/User");
const Account = require("../../models/Account");

// @route GET api/user
// @desc Get user profile
// @access Private
router.get("/userinfo", verifyToken, async (req, res) => {
  try {
    user = await User.findOne({ account: req.accountId });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

// @route PUT api/userId
// @desc Edit user profile
// @access Private
router.put("/userinfo", verifyToken, async (req, res) => {
  const {
    bloodtype,
    height,
    weight,
    pastmedicalhistory,
    drughistory,
    familyhistory,
  } = req.body;

  try {
    let updatedUser = {
      bloodtype,
      height,
      weight,
      pastmedicalhistory,
      drughistory,
      familyhistory,
    };

    const profileupdatecondition = {
      account: req.accountId,
    };
    updatedUser = await User.findOneAndUpdate(
      profileupdatecondition,
      updatedUser,
      { new: true }
    );

    // User not authorized to update profile
    if (!updatedUser)
      return res.status(400).json({
        success: false,
        message: "Người dùng không có quyền cập nhật profile này",
      });

    res.json({
      success: true,
      message: "Cập nhật người dùng thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

// @route POST api/userId/changepassword
// @desc change user's password
// @access Private
router.post("/changepassword", verifyToken, async (req, res) => {
  const { password, newpass } = req.body;

  //get current password in DB and compare it with inputted old password by user
  const account = await Account.findOne({ _id: req.accountId });
  const passwordvalid = await argon2.verify(account.password, password);
  if (!passwordvalid)
    return res
      .status(400)
      .json({ success: false, message: "Sai mật khẩu hiện tại" });

  if (newpass === password)
    return res
      .status(400)
      .json({ success: false, message: "Mật khẩu mới trùng với mật khẩu cũ, xin kiểm tra lại" });
      
  const hashedNewPassword = await argon2.hash(newpass);

  try {
    let updatedPassword = {
      password: hashedNewPassword,
    };
    const profileupdatecondition = { _id: req.accountId };
    updatedPassword = await Account.findOneAndUpdate(
      profileupdatecondition,
      updatedPassword,
      { new: true }
    );

    res.json({
      success: true,
      message: "Mật khẩu mới đã được cập nhật",
      account: updatedPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

module.exports = router;
