require("dotenv").config();
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../middleware/auth");

const accountSid = "AC1c6a2f18fd50d22ba3a9358fdb63a961";
const authToken = "e3af8c089b470cd799237d2e613ff216";
const client = require("twilio")(accountSid, authToken);

const Account = require("../../models/Account");
const User = require("../../models/User");

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const {
    profilepic,
    birthday,
    gender,
    email,
    phone,
    password,
    fname,
    lname,
    city,
    district,
    ward,
    street,
    role,
  } = req.body;

  //simple validation
  if (!phone || !password || !fname || !lname || !role)
    return res.status(400).json({ success: false, message: "Thiếu thông tin" });

  try {
    //check for existing account
    const exists = await Account.findOne({ phone });

    if (exists)
      return res.status(400).json({
        success: false,
        message: "Số điện thoại đã được đăng ký ở tài khoản khác",
      });

    //OK!
    const hashedPassword = await argon2.hash(password);
    const newAccount = new Account({
      profilepic,
      birthday,
      gender,
      email,
      fname,
      lname,
      phone,
      password: hashedPassword,
      address: { city, district, ward, street },
      role,
    });
    await newAccount.save();

    // Return token
    const accessToken = jwt.sign(
      { accountId: newAccount._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    const account = await Account.findOne({ _id: newAccount._id });

    res.json({
      success: true,
      account: account,
      message: "Tạo tài khoản thành công",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

router.post("/sendcode", async (req, res) => {
  const { phone } = req.body;

  //send code to phone number
  try {
    client.verify
      .services("VA85da000b869107ba0c8f11f348519989")
      .verifications.create({ to: phone, channel: "sms" })
      .then((verification) => res.json({ message: verification.status }));
  } catch (error) {
    res.json({ message: "Lỗi máy chủ" });
  }
});

router.post("/verifycode", async (req, res) => {
  const { phone, code } = req.body;

  //check verify code
  try {
    await client.verify
      .services("VA85da000b869107ba0c8f11f348519989")
      .verificationChecks.create({ to: phone, code: code })
      .then((verification_check) =>
        res.json({ message: verification_check.status })
      );
  } catch (error) {
    res.json({ message: "Lỗi máy chủ" });
  }
});

router.post("/createuser", verifyToken, async (req, res) => {
  //check for existing account
  const user = await User.findOne({ account: req.accountId });
  if (user)
    return res
      .status(400)
      .json({ success: false, message: "Người dùng này đã được tạo trước đó" });

  //create a new user based on the above account

  try {
    const newUser = new User({
      account: req.accountId,
    });
    await newUser.save();

    res.json({
      success: true,
      message: "Tạo người dùng thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  //simple validation
  if (!phone || !password)
    return res.status(400).json({ success: false, message: "Thiếu thông tin" });

  try {
    // Check for existing account
    const account = await Account.findOne({ phone });
    if (!account)
      return res
        .status(400)
        .json({ success: false, message: "Sai số điện thoại" });

    // phone found
    const passwordValid = await argon2.verify(account.password, password);
    if (!passwordValid)
      return res.status(400).json({ success: false, message: "Sai mật khẩu" });

    //OK!
    //Return token
    const accessToken = jwt.sign(
      { accountId: account._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      account: account,
      accessToken,
      role: account.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

// @route POST api/auth/resetpassword
// @desc Reset password of user
// @access Public
router.post("/resetpassword", async (req, res) => {
  const { phone, newpassword } = req.body;

  //simple validation
  if (!phone || !newpassword)
    return res.status(400).json({ success: false, message: "Thiếu thông tin" });

  try {
    // Check for existing account
    const account = await Account.findOne({ phone });
    if (!account)
      return res
        .status(400)
        .json({ success: false, message: "Sai số điện thoại" });

    // phone found and pass verification
    const passwordvalid = await argon2.verify(account.password, newpassword);
    if (passwordvalid)
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới giống với mật khẩu hiện tại",
      });
    const hashedNewPassword = await argon2.hash(newpassword);

    try {
      let updatedPassword = {
        password: hashedNewPassword,
      };
      const profileupdatecondition = { _id: account._id };
      updatedPassword = await Account.findOneAndUpdate(
        profileupdatecondition,
        updatedPassword,
        { new: true }
      );

      res.json({
        success: true,
        message: "Mật khẩu mới đã được cập nhật",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Lỗi nội bộ" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});
module.exports = router;
