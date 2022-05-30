const express = require("express");
const router = express.Router();

var nodemailer = require("nodemailer");

router.post("/send", async (req, res) => {
  let data = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: "vanlangdoctor.tech@gmail.com",
      pass: "decsypfymmbmgkmr",
    },
  });

  let mailOptions = {
    from: data.email,
    to: "vanlangdoctor.tech@gmail.com",
    subject: data.subject,
    // text: `Emai: ${data.email}`,
    html: `
    <h3>Thông tin</h3>
        <ul>
        <li>Tên: ${data.name}</li>
        <li>Email: ${data.email}</li>
        </ul>
    
    <h3>Lời nhắn</h3>
    <p>${data.text}</p>    
    `,
  };

  await transporter.sendMail(mailOptions, function (error) {
    if (error) {
      return res.json({
        message: "Lỗi",
        error,
      });
    } else {
      // console.log("Email sent: " + info.response);
      return res.json({
        message: "Gửi email thành công",
      });
    }
  });
});

module.exports = router;
