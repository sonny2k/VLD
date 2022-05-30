const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Không có Access Token" });

  try {
    const decoded = jwt.verify(token, "team16");

    req.accountId = decoded.accountId;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ success: false, message: "Token không đúng" });
  }
};

module.exports = verifyToken;
