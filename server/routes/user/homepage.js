const express = require("express");
const router = express.Router();
const Account = require("../../models/Account");
const Department = require("../../models/Department");
const Doctor = require("../../models/Doctor");

router.get("/doctor", async (req, res) => {
  const alldoctors = await Account.find({ role: "Bác sĩ" });
  res.send(alldoctors);
});

router.get("/doctor/:id", async (req, res) => {
  const adoctor = await Doctor.findOne({ _id: req.params.id }).populate('account');
  res.send(adoctor);
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
