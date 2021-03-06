const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const { cloudinary } = require('../../utils/cloudinary');

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

// @route PUT api/user/account/info
// @desc Edit user profile
// @access Private
router.put("/info", verifyToken, async (req, res) => {
  const {
    fname,
    lname,
    birthday,
    gender,
    email,
    city,
    district,
    ward,
    street,
  } = req.body;

  try {
    let updatedAccount = {
      fname,
      lname,
      birthday,
      gender,
      email,
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
      account: updatedAccount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

// @route POST api/user/account/profilepic
// @desc Edit user profile pic
// @access Private
router.post("/profilepic", verifyToken, async (req, res) => {

  try {
    const fileStr = req.body.pic;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    console.log(uploadResponse.secure_url);
    try {
      let updatedAccount = {
        profilepic: uploadResponse.secure_url
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
        message: "Cập nhật ảnh đại diện thành công",
        account: updatedAccount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Lỗi nội bộ" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Có lỗi xảy ra, vui lòng thử lại' });
  }
});

module.exports = router;
