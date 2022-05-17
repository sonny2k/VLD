const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Account = require("../../models/Account");
const Doctor = require("../../models/Doctor");

router.post("/rating", verifyToken, async (req, res) => {
  const { num, data } = req.body;
  const { ratings } = data;

  const aaa = await Account.findOne({ account: req.accountId });
  const doctorraw = await Doctor.findOne({ aaa });
  const doctorId = doctorraw._id;
  try {
    Doctor.updateOne(
      { doctor: doctorId },
      {
        $set: {
          [`${num}.ratings`]: ratings,
        },
      }
    ).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );
    res.json({ success: true, message: "thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tải dữ liệu" });
  }
});

module.exports = router;
