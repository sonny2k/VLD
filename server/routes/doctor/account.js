const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

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
  const {
    date1,
    date2,
    date3,
    date4,
    date5,
    date6,
    date7,
    hour11,
    hour12,
    hour13,
    hour21,
    hour22,
    hour23,
    hour31,
    hour32,
    hour33,
    hour41,
    hour42,
    hour43,
    hour51,
    hour52,
    hour53,
    hour61,
    hour62,
    hour63,
    hour71,
    hour72,
    hour73,
  } = req.body;

  const doctorraw = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctorraw._id;

  try {
    Doctor.updateOne(
      { _id: doctorId },
      {
        $set: {
          "availables.0.date": date1,
          "availables.1.date": date2,
          "availables.2.date": date3,
          "availables.3.date": date4,
          "availables.4.date": date5,
          "availables.5.date": date6,
          "availables.6.date": date7,
          "availables.0.hours.0.time": hour11,
          "availables.0.hours.1.time": hour12,
          "availables.0.hours.2.time": hour13,
          "availables.1.hours.0.time": hour21,
          "availables.1.hours.1.time": hour22,
          "availables.1.hours.2.time": hour23,
          "availables.2.hours.0.time": hour31,
          "availables.2.hours.1.time": hour32,
          "availables.2.hours.2.time": hour33,
          "availables.3.hours.0.time": hour41,
          "availables.3.hours.1.time": hour42,
          "availables.3.hours.2.time": hour43,
          "availables.4.hours.0.time": hour51,
          "availables.4.hours.1.time": hour52,
          "availables.4.hours.2.time": hour53,
          "availables.5.hours.0.time": hour61,
          "availables.5.hours.1.time": hour62,
          "availables.5.hours.2.time": hour63,
          "availables.6.hours.0.time": hour71,
          "availables.6.hours.1.time": hour72,
          "availables.6.hours.2.time": hour73,
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
