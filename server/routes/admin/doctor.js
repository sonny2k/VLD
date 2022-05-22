const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const verifyToken = require("../../middleware/auth");
const Account = require("../../models/Account");
const Doctor = require("../../models/Doctor");

router.get("/viewDoctor", verifyToken, async (req, res) => {
  try {
    const doctorList = await Doctor.find().populate("account");
    res.json(doctorList);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.post("/createDoctor", verifyToken, async (req, res) => {
  const { fname, lname, phone, department } = req.body;
  try {
    //check for existing account
    const exists = await Account.findOne({ phone });

    if (exists)
      return res.json({
        success: false,
        message: "Số điện thoại đã được đăng ký ở tài khoản khác",
      });

    const hashedPassword = await argon2.hash("vld12345");

    const newAccount = new Account({
      fname,
      lname,
      phone,
      role: "Bác sĩ",
      password: hashedPassword,
      address: { city: "", district: "", ward: "", street: "" },
    });
    await newAccount.save();

    const newDoctor = new Doctor({
      account: newAccount._id,
      department: department,
      description: "",
      educationplace: "",
      workcertificate: "",
      excellence: "",
      level: "",
      workhistory: "",
      education: "",
      degree: "",
      availables: [
        { date: "", hours: [] },
        { date: "", hours: [] },
        { date: "", hours: [] },
        { date: "", hours: [] },
        { date: "", hours: [] },
        { date: "", hours: [] },
        { date: "", hours: [] },
      ],
    });
    await newDoctor.save();
    res.json({
      success: true,
      message: "Tạo bác sĩ thành công",
      newDoctor,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.put("/updateDoctor/:id", verifyToken, async (req, res) => {
  const {
    department,
    description,
    educationplace,
    workcertificate,
    degree,
    excellence,
    level,
    workhistory,
    education,
  } = req.body;

  try {
    let updateDoc = {
      department,
      description,
      educationplace,
      workcertificate,
      degree,
      excellence,
      level,
      workhistory,
      education,
      degree,
    };
    const DocupdateCondition = {
      _id: req.params.id,
    };
    upDoc = await Doctor.findOneAndUpdate(DocupdateCondition, updateDoc, {
      new: true,
    });
    if (!upDoc)
      return res.json({
        success: false,
        message: "không có quyền cập nhật bác sĩ",
      });
    res.json({
      success: true,
      message: "Bạn đã cập nhật bác sĩ thành công",
      upDoc,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.delete("/deleteDoctor/:id", verifyToken, async (req, res) => {
  try {
    deDoc = await Doctor.findOneAndDelete({ _id: req.params.id });
    if (!deDoc)
      return res.status(400).json({
        success: false,
        message: "Không có quyền xóa bác sĩ",
      });
    res.json({
      success: true,
      message: "Xóa bác sĩ thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

//Delete Any Doctor
router.post("/deleteDoctor", verifyToken, async (req, res) => {
  const { data } = req.body;
  try {
    Doctor.deleteMany({ _id: { $in: data } }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );
    Account.deleteMany({
      _id: { $in: Doctor.find({ _id: { $in: data } }).account },
    }).then(
      (result) => {
        console.log(result);
      },
      (e) => {
        console.log(e);
      }
    );
    res.json({
      success: true,
      message: "Xóa bác sĩ thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/viewDoc/:id", verifyToken, async (req, res) => {
  try {
    const docListdetail = await Doctor.findOne({ _id: req.params.id });
    res.json({ success: true, docListdetail });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
  }
});

router.get("/searchDoctor/:lname", verifyToken, async (req, res) => {
  try {
    var keyword = new RegExp(req.params.lname, "i");
    console.log(`${keyword}`);
    const findName = await Account.find({
      $or: [
        {
          lname: keyword,
        },
        { fname: keyword },
      ],
    });
    if (!findName) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bác sĩ này" });
    }
    res.send(findName);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi tìm kiếm" });
  }
});

module.exports = router;
