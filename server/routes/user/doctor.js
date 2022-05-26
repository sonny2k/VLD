const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Account = require("../../models/Account");
const Doctor = require("../../models/Doctor");

router.post("/rating", verifyToken, async (req, res) => {
  const { content, star, date, doctor } = req.body;

  try {
    Doctor.UpdateOne(
      { _id: doctor },
      {
        $set: {
          [`ratings.$.user`]: req.accountId,
          [`ratings.$.content`]: content,
          [`ratings.$.star`]: star,
          [`ratings.$.date`]: date,
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
