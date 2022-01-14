const express = require("express");
const router = express.Router();
const Doctor = require("../../models/Doctor");

router.get("/", async (res) => {
  const alldoctors = await Doctor.find();
  res.send(alldoctors);
});

module.exports = router;
