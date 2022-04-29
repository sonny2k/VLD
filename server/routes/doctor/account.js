const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Consultation = require("../../models/Consultation");

const Doctor = require("../../models/Doctor");
const { cloudinary } = require("../../utils/cloudinary");

router.get("/info", verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ account: req.accountId });
    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

router.post("/signature/:id", verifyToken, async (req, res) => {
  try {
    const fileSign = req.body.signature;
    const uploadRES = await cloudinary.uploader.upload(fileSign);
    console.log(uploadRES.secure_url);
    try {
      let updateDoctor = {
        signature: uploadRES.secure_url,
      };

      const signatureupdatecondition = { _id: req.params.id };

      upDoc = await Doctor.findOneAndUpdate(
        signatureupdatecondition,
        updateDoctor,
        { new: true }
      );
      if (!upDoc)
        return res.status(400).json({
          success: false,
          message: "Người dùng không có quyền cập nhật tài khoản",
        });
      res.json({
        success: true,
        message: "Cập nhật chữ ký thành công",
        doctor: updateDoctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Lỗi nội bộ" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại" });
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

module.exports = router;
