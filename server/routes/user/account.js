const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Account = require("../../models/Account");

// @route GET api/user/account/info
// @desc Get user account
// @access Private
router.get("/info", verifyToken, async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.accountId });
    res.json({ success: true, account });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

// @route PUT api/user/account
// @desc Edit user profile
// @access Private
router.put("/info", verifyToken, async (req, res) => {
  const {
    profilepic,
    fname,
    lname,
    birthday,
    gender,
    city,
    district,
    ward,
    street,
  } = req.body;

  const datebirthday = new Date(birthday);
  try {
    let updatedAccount = {
      profilepic,
      fname,
      lname,
      datebirthday,
      gender,
      address: { city, district, ward, street },
    };

    const profileupdatecondition = { _id: req.accountId };
    updatedAccount = await Account.findOneAndUpdate(
      profileupdatecondition,
      updatedAccount,
      { new: true }
    );

    // User not authorized to update profile
    if (!updatedAccount)
      return res.status(400).json({
        success: false,
        message: "Người dùng không có quyền cập nhật tài khoản này",
      });

    res.json({
      success: true,
      message: "Cập nhật tài khoản thành công",
      user: updatedAccount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});
module.exports = router;
