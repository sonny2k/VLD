require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dm92pmz6s",
  api_key: "872796819671222",
  api_secret: "x6GUosbavFf4NYMmYgjJUOJn2u4",
});

module.exports = { cloudinary };
