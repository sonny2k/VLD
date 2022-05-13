const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const { cloudinary } = require("../../utils/cloudinary");

const Doctor = require("../../models/Doctor");

router.get("/info", verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ account: req.accountId });
    res.json(doctor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

router.post("/workingtime", verifyToken, async (req, res) => {
  const { numOfDay, data } = req.body;

  const { date, hours } = data;

  const doctorraw = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctorraw._id;
  try {
    Doctor.updateOne(
      { _id: doctorId },
      {
        $set: {
          [`availables.${numOfDay}.date`]: date,
          [`availables.${numOfDay}.hours`]: hours,
        },
      }
    ).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );

    res.json({
      success: true,
      message: "Cập nhật thời gian làm việc thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/detailinfo", verifyToken, async (req, res) => {
  const {
    educationplace,
    workcertificate,
    level,
    degree,
    description,
    excellence,
    workhistory,
    education,
  } = req.body;

  try {
    let updatedAccount = {
      educationplace,
      workcertificate,
      level,
      degree,
      description,
      excellence,
      workhistory,
      education,
    };

    const profileupdatecondition = { account: req.accountId };
    updatedAccount = await Doctor.findOneAndUpdate(
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
      message: "Cập nhật chi tiết tài khoản thành công",
      account: updatedAccount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

router.post("/signature", verifyToken, async (req, res) => {
  try {
    const fileStr = req.body.pic;
    const uploadResponse = await cloudinary.uploader.upload(fileStr);
    console.log(uploadResponse.secure_url);
    try {
      let updatedAccount = {
        signature: uploadResponse.secure_url,
      };

      const profileupdatecondition = { account: req.accountId };
      updatedAccount = await Doctor.findOneAndUpdate(
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
        message: "Cập nhật ảnh chữ ký thành công",
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
