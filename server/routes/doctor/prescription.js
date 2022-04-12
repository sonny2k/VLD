const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Consultation = require("../../models/Consultation");
const Doctor = require("../../models/Doctor");
const Prescription = require("../../models/Prescription");

router.get("/viewListPreDoc", verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ account: req.accountId });
    const doctorID = doctor._id;
    const consult = await Consultation.findOne({ doctorID });
    const conID = consult._id;

    var popu = { path: "consultation", populate: { path: "doctor" } };

    const preListDoc = await Prescription.find({
      consultation: conID,
    }).populate(popu);
    res.json(preListDoc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updatePreDoc/:id", verifyToken, async (req, res) => {
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
    const doctor = await Doctor.findOne({ account: req.accountId });
    const doctorID = doctor._id;
    const consultations = await Consultation.findOne({ doctorID });
    const conID = consultations._id;
    let updatePreDoc = {
      consultation: date,
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

module.exports = router;
