const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");
const Prescription = require("../../models/Prescription");
const Notification = require("../../models/Notification");
const fns = require("date-fns");

router.get(
  "/viewListPrescription/detail/:id",
  verifyToken,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ account: req.accountId });
      const doctorID = doctor._id;
      const consult = await Consultation.findOne({ doctorID });
      const conID = consult._id;

      var popu = { path: "consultation", populate: { path: "doctor" } };

      const preListDoc = await Prescription.findOne({
        consultation: conID,
        _id: req.params.id,
      }).populate(popu);
      res.json(preListDoc);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Lỗi tải dữ liệu",
      });
    }
  }
);

router.post("/createPrescription", verifyToken, async (req, res) => {
  const { consultation, pname, diagnosis, note, medicines } = req.body;

  const doctorraw = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctorraw._id;

  const consultationraw = await Consultation.findOne({ _id: consultation });
  const id = consultationraw._id;
  const consultdate = consultationraw.date;
  const consulthour = consultationraw.hour;
  const userId = consultationraw.user;

  try {
    const newPre = new Prescription({
      consultation,
      pname,
      diagnosis,
      note,
      medicines: medicines,
    });
    await newPre.save();

    let updatedConsultation = {
      status: "đã hoàn thành",
    };

    const consultationupdatecondition = { doctor: doctorId, _id: consultation };
    updatedConsult = await Consultation.findOneAndUpdate(
      consultationupdatecondition,
      updatedConsultation,
      { new: true }
    );

    // User not authorized to update consultation
    if (!updatedConsultation)
      return res.status(400).json({
        success: false,
        message: "Người dùng không có quyền cập nhật lịch hẹn này",
      });

    var dateTime = Date.now();
    const newNotice = new Notification({
      title: "Toa thuốc cho bạn",
      message: `toa thuốc của buổi hẹn ngày ${fns.format(
        consultdate,
        "dd/MM/yyyy"
      )} lúc ${consulthour} đã được kê`,
      creator: doctorId,
      recipient: userId,
      notidate: dateTime,
      seen: false,
      type: "createprescription",
      path: id,
    });
    await newNotice.save();

    res.json({
      success: true,
      message: "Bạn đã tạo toa thuốc thành công",
      newPre,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updatePrescription/:id", verifyToken, async (req, res) => {
  const { consultation, pname, diagnosis, note, medicines } = req.body;

  try {
    const doctorraw = await Doctor.findOne({ account: req.accountId });
    const doctorId = doctorraw._id;

    const consultationraw = await Consultation.findOne({ _id: consultation });
    const conId = consultationraw._id;
    const consultdate = consultationraw.date;
    const consulthour = consultationraw.hour;
    const userId = consultationraw.user;

    let updatePreDoc = {
      pname,
      diagnosis,
      note,
      medicines: medicines,
    };
    const PreupdateDocCondition = {
      consultation: conId,
      _id: req.params.id,
    };
    upPreDoc = await Prescription.findOneAndUpdate(
      PreupdateDocCondition,
      updatePreDoc,
      {
        new: true,
      }
    );

    if (!upPreDoc)
      return res.status(400).json({
        success: false,
        message: " Bác sĩ không có quyền cập nhật toa thuốc",
      });

    var dateTime = Date.now();
    const newNotice = new Notification({
      title: "Toa thuốc cho bạn",
      message: `toa thuốc của buổi hẹn ngày ${fns.format(
        consultdate,
        "dd/MM/yyyy"
      )} lúc ${consulthour} đã được cập nhật`,
      creator: doctorId,
      recipient: userId,
      notidate: dateTime,
      seen: false,
      type: "updateprescription",
      path: id,
    });
    await newNotice.save();
    res.json({
      success: true,
      message: "Cập nhật toa thuốc thành công",
      upPreDoc,
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
