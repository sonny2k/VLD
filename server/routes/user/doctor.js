const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Account = require("../../models/Account");
const Doctor = require("../../models/Doctor");

router.post("/rating", verifyToken, async (req, res) => {
  const { num, data } = req.body;
  const { user, content, star, date } = data;

  const acc = await Account.findOne({ account: req.accountId });
  const doctorraw = await Doctor.findOne({ acc });
  const doctorId = doctorraw._id;
  try {
    Doctor.updateOne(
      { _id: doctorId },
      {
        $set: {
          [`ratings.${num}.user`]: user,
          [`ratings.${num}.content`]: content,
          [`ratings.${num}.star`]: star,
          [`ratings.${num}.date`]: date,
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
    console.log(data);
    res.json({ success: true, message: "Thêm đánh giá thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tải dữ liệu" });
  }
});

module.exports = router;
