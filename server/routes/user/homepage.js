const express = require("express");
const router = express.Router();
const Doctors = require("../../models/Doctors");
const Articles = require("../../models/Articles");

router.get("/", async (req, res) => {
  const alldoctors = await Doctors.find();
  const allarticles = await Articles.find();
  res.send(alldoctors + allarticles);
});

module.exports = router;
