const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const { cloudinary } = require("../../utils/cloudinary");

const Account = require("../../models/Account");
const Doctor = require("../../models/Doctor");

router.get("/filter", verifyToken, async (req, res) => {
  try {
    filter = {};
    // const department = req.query.department;
    const { department, lname, fname, level, workcertificate } = req.query;

    // if (department && level) {
    //   filter = { department };
    // }
    if (department) {
      filter = { department };
    }
    let doctorList = await Doctor.find(filter)
      .populate("department")
      .populate("account");
    if (!doctorList) {
      res
        .status(500)
        .json({ success: false, message: "Không tìm được bác sĩ" });
    }

    // doctorList.map((doctor)=> doctor.account.filter(()))
    if (lname) {
      doctorList = doctorList.filter((doctor) =>
        // doctor.account.find((acc) => acc.lname.toLowerCase().includes(lname))
        doctor.account.lname.toLowerCase().includes(lname.toLowerCase())
      );
    }
    if (fname) {
      doctorList = doctorList.filter((doctor) =>
        doctor.account.fname.toLowerCase().includes(fname.toLowerCase())
      );
    }
    if (level) {
      doctorList = doctorList.filter((doctor) =>
        doctor.level.toLowerCase().includes(level.toLowerCase())
      );
    }
    if (workcertificate) {
      doctorList = doctorList.filter((doctor) =>
        doctor.workcertificate
          .toLowerCase()
          .includes(workcertificate.toLowerCase())
      );
    }
    console.log(doctorList);
    res.send(doctorList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi lọc hoặc tìm kiếm" });
  }
});

router.get("/search/:lname", verifyToken, async (req, res) => {
  try {
    var keyword = new RegExp(req.params.lname, "i");
    console.log(`${keyword}`);
    const findName = await Account.find({
      $or: [
        {
          lname: keyword,
        },
        { fname: keyword },
      ],
    });
    if (!findName) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bác sĩ này" });
    }
    res.send(findName);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
  }
});

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

// @route PUT api/user/account/profilepic
// @desc Edit user profile pic
// @access Private
router.post("/profilepic", verifyToken, async (req, res) => {
  try {
    const fileStr = req.body.pic;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    console.log(uploadResponse.secure_url);
    try {
      let updatedAccount = {
        profilepic: uploadResponse.secure_url,
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
    res.status(500).json({ err: "Có lỗi xảy ra, vui lòng thử lại" });
  }
});

module.exports = router;
