const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");

router.get("/viewlistconsult", verifyToken, async (req, res) => {
  try {
    const allconsultlist = await Consultation.find();
    res.json(allconsultlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

module.exports = router;
