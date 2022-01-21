const express = require("express");
const router = express.Router();
const Doctors = require("../../models/Doctor");
const Departments = require("../../models/Department");

router.get("/doctor", async (req, res) => {
  const alldoctors = await Doctors.find().populate("account", [
    "profilepic",
    "fname",
    "lname",
  ]);
  res.send(alldoctors);
});

router.get("/doctor/:id", async (req, res) => {
  const adoctor = await Doctors.findOne({ _id: req.params.id });
  res.send(adoctor);
});

router.get("/docdep/:id", async (req, res) => {
  const doctordep = await Doctors.find({ department: req.params.id });
  res.send(doctordep);
});

router.get("/docacc/:id", async (req, res) => {
  const doctoracc = await Doctors.find({ account: req.params.id });
  res.send(doctoracc);
});

router.get("/department", async (req, res) => {
  const alldepartments = await Departments.find();
  res.send(alldepartments);
});

module.exports = router;
