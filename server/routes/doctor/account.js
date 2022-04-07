const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

const Doctor = require("../../models/Doctor");

router.get("/info", verifyToken, async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ account: req.accountId });
      res.json(doctor);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Lỗi nội bộ" });
    }
  });

module.exports = router;