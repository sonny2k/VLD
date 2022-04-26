require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const verifyToken = require("../../middleware/auth");
const twilioClient = require("twilio")(
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { accountSid: process.env.TWILIO_ACCOUNT_SID }
  );

  const findOrCreateRoom = async (roomName) => {
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
    }
  };

  const getAccessToken = (roomName) => {
    // Tạo accesstoken
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY_SID,
      process.env.TWILIO_API_KEY_SECRET,
      // generate a random unique identity for this participant
      // { identity: uuidv4() }
    );
    // Tạo quyền tham gia phòng họp có chưa tên phòng họp
    const videoGrant = new VideoGrant({
      room: roomName,
    });
  
    // Thêm quyền vào accesstoken
    token.addGrant(videoGrant);
    // Mã hóa token và trả về
    return token.toJwt();
  };

  router.post("/join-room", async (req, res) => {
    // Trả kết quả 400 nếu request rỗng hoặc request không có tên phòng tư vấn
    if (!req.body || !req.body.roomName) {
      return res.status(400).send("Chưa có tên phòng tư vấn");
    }
    const roomName = req.body.roomName;
    // Tìm phòng hoặc tạo phòng dựa theo tên phòng trong request
    findOrCreateRoom(roomName);
    // Tạo accesstoken cho người dùng truy cập vào phòng
    const token = getAccessToken(roomName);
    res.send({
      token: token,
    });
  });

  module.exports = router;