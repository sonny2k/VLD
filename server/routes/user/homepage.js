const express = require("express");
const router = express.Router();
const Doctors = require("../../models/Doctor");
const Departments = require("../../models/Department");
const Articles = require("../../models/Article");
const ArticleCategories = require("../../models/ArticleCategory");

router.get("/doctor", async (req, res) => {
  const alldoctors = await Doctors.find();
  res.send(alldoctors);
});

router.get("/department", async (req, res) => {
  const alldepartments = await Departments.find();
  res.send(alldepartments);
});
module.exports = router;
