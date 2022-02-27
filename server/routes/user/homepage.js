const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Department = require("../../models/Department");
const Doctor = require("../../models/Doctor");

router.get("/doctor", async (req, res) => {
  const alldoctors = await Doctor.find().populate('account');
  res.send(alldoctors);
});

router.get("/doctor/:id", async (req, res) => {
  try {
    const adoctor = await Doctor.findOne({ _id: req.params.id }).populate('account');
    if (!adoctor)
      return res.status(400).json({ success: false, message: "Không tìm thấy bác sĩ này" });
    res.send(adoctor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi nội bộ" });
  }
});

router.get("/docdep/:id", async (req, res) => {
  const doctor = await Doctor.find({ department: req.params.id });
  res.send(doctor);
});

router.get("/department", async (req, res) => {
  const alldepartments = await Department.find();
  res.send(alldepartments);
});

module.exports = router;
