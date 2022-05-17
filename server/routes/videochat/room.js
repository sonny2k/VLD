require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const verifyToken = require("../../middleware/auth");
const Notification = require("../../models/Notification");
const fns = require("date-fns");
const Account = require("../../models/Account");
const User = require("../../models/User");
const Doctor = require("../../models/Doctor");
const twilioClient = require("twilio")(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

const findOrCreateRoom = async (roomName) => {
  const acc = await Account.findOne({ account: req.accountId });
  const userr = await User.findOne({ acc });
  const IdUser = userr._id;
  const doctorr = await Doctor.findOne({ acc });
  const IdDoctor = doctorr._id;
  try {
    // Nếu chưa có phòng này sẽ báo lỗi 20404
    await twilioClient.video.rooms(roomName).fetch();
  } catch (error) {
    // Tạo phòng mới vì chưa tồn tại
    if (error.code == 20404) {
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: "go",
      });
    } else {
      // Báo lỗi khác
      throw error;
    }
    var dateTime = Date.now();
    const newNotice = new Notification({
      title: "Tạo phòng tư vấn",
      message: `phòng tư vấn vào ngày ${fns.format(
        roomName.date,
        "dd/MM/yyyy"
      )} lúc${roomName.hour}`,
      creator: IdDoctor,
      recipient: IdUser,
      notidate: dateTime,
      seen: false,
      type: "createroom",
      path: _id,
    });
    await newNotice.save();
    res.json({ success: true, message: "Bạn đã tạo phòng thành công" });
    newNotice;
  }
};

const getAccessToken = (roomName, username) => {
  // Tạo accesstoken
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET
  );
  // Tạo quyền tham gia phòng họp có chưa tên phòng họp
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  // Thêm quyền vào accesstoken
  token.addGrant(videoGrant);
  token.identity = username;
  // Mã hóa token và trả về
  return token.toJwt();
};

router.post("/join-room", async (req, res) => {
  // Trả kết quả 400 nếu request rỗng hoặc request không có tên phòng tư vấn
  if (!req.body || !req.body.roomName || !req.body.username) {
    return res
      .status(400)
      .send("Chưa có tên phòng tư vấn hoặc thiếu danh tính người tham gia");
  }
  const roomName = req.body.roomName;
  const username = req.body.username;
  // Tìm phòng hoặc tạo phòng dựa theo tên phòng trong request
  findOrCreateRoom(roomName);
  // Tạo accesstoken cho người dùng truy cập vào phòng
  const token = getAccessToken(roomName, username);
  res.send({
    token: token,
  });
});

module.exports = router;
