const express = require("express");
const router = express.Router();
const Doctors = require("../../models/Doctor");
const Departments = require("../../models/Department");

// @route GET api/doctor
// @desc get doctor list
// @access public
router.get("/doctor", async (req, res) => {
  const alldoctors = await Doctors.find().populate("account", [
    "profilepic",
    "fname",
    "lname",
  ]);
  res.send(alldoctors);
});

// @route GET api/doctorid
// @desc get doctor list by id
// @access public
router.get("/doctor/:id", async (req, res) => {
  const adoctor = await Doctors.findOne({ _id: req.params.id });
  res.send(adoctor);
});

// @route GET api/doctorid
// @desc get doctor list by department id
// @access public
router.get("/docdep/:id", async (req, res) => {
  const doctordep = await Doctors.find({ department: req.params.id });
  res.send(doctordep);
});

// @route GET api/doctorid
// @desc get doctor list by account id
// @access public
router.get("/docacc/:id", async (req, res) => {
  const doctoracc = await Doctors.find({ account: req.params.id });
  res.send(doctoracc);
});

// @route GET api/doctorid
// @desc get department list
// @access public
router.get("/department", async (req, res) => {
  const alldepartments = await Departments.find();
  res.send(alldepartments);
});

module.exports = router;
