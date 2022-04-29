const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");
const Prescription = require("../../models/Prescription");
const Notification = require("../../models/Notification");

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
  const doctorraw = await Doctor.findOne({ account: req.accountId });
  const doctorId = doctorraw._id;
  const userr = await User.findOne({ user: req.accountId });
  const userId = userr._id;
  const {
    consultation,
    pname,
    diagnosis,
    note,
    product,
    quantity,
    morningrate,
    noonrate,
    everate,
    specdes,
  } = req.body;

  try {
    const newPre = new Prescription({
      consultation,
      pname,
      diagnosis,
      note,
      medicines: { product, quantity, morningrate, noonrate, everate, specdes },
    });
    await newPre.save();

    var dateTime = Date.now();
    const newNotice = new Notification({
      title: "Xác nhận đặt lịch",
      message: "Bạn đang có 1 toa thuốc",
      creator: doctorId,
      recipient: userId,
      notidate: dateTime,
      seen: false,
      path: newPre._id,
    });
    await newNotice.save();

    res.json({
      success: true,
      message: "Bạn đã tạo toa thuốc thành công",
      newPre,
      newNotice,
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
  const {
    pname,
    diagnosis,
    note,
    product,
    quantity,
    morningrate,
    noonrate,
    everate,
    specdes,
  } = req.body;

  try {
    const doctor = await Doctor.findOne({ account: req.accountId });
    const idDoctor = doctor._id;
    const consult = await Consultation.findOne({ idDoctor });
    const conID = consult._id;

    let updatePreDoc = {
      pname,
      diagnosis,
      note,
      medicines: { product, quantity, morningrate, noonrate, everate, specdes },
    };
    const PreupdateDocCondition = {
      consultation: conID,
      _id: req.params.id,
    };
    upPreDoc = await Prescription.findOneAndUpdate(
      PreupdateDocCondition,
      updatePreDoc,
      {
        new: true,
      }
    );
    console.log(req.params.id);
    console.log(idDoctor);
    console.log(conID);
    console.log(upPreDoc);

    if (!upPreDoc)
      return res.status(400).json({
        success: false,
        message: " Bác sĩ không có quyền cập nhật toa thuốc",
      });
    res.json({
      success: true,
      message: "Cập nhật toa thuốc thành công",
      consultations: upPreDoc,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.delete("/deletePrescription/:id", verifyToken, async (req, res) => {
  try {
    dePre = await Prescription.findOneAndDelete({ _id: req.params.id });
    if (!dePre)
      return res
        .status(400)
        .json({ success: false, message: "Không có quyền xóa toa thuốc" });
    res.json({
      success: true,
      message: "Xóa toa thuốc thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/searchPrescription/:diagnosis", verifyToken, async (req, res) => {
  try {
    var keywordPre = new RegExp(req.params.diagnosis, "i");
    console.log(`${keywordPre}`);
    const findDiagnosis = await Prescription.find({ diagnosis: keywordPre });
    if (!keywordPre) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy toa thuốc này" });
    }
    res.send(findDiagnosis);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
  }
});

module.exports = router;
