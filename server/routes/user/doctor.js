const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Account = require("../../models/Account");
const Doctor = require("../../models/Doctor");

router.post("/rating", verifyToken, async (req, res) => {
  const { content, star, date, doctor } = req.body;

  try {
    Doctor.updateOne(
      { _id: doctor },
      {
        $push: {
          ratings: {
            user: req.accountId,
            content: content,
            star: star,
            date: date,
            status: 0,
          },
        },
      }
    ).then(
      (result) => {
        console.log(result);
        res.json({ success: true, message: "Thêm đánh giá thành công" });
      },
      (e) => {
        console.log(e);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tải dữ liệu" });
  }
});

module.exports = router;
