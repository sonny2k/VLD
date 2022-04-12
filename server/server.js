require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authUserRouter = require("./routes/user/auth");
const userRouter = require("./routes/user/user");
const accountUserRouter = require("./routes/user/account");
const homepageRouter = require("./routes/user/homepage");
const consultationUserRouter = require("./routes/user/consultation");
const prescriptionRouter = require("./routes/user/prescription");
const departmentRouter = require("./routes/admin/department");
const articleRouter = require("./routes/admin/article");
const doctoradminRouter = require("./routes/admin/doctor");
const productRouter = require("./routes/admin/product");
const notificationRouter = require("./routes/admin/notification");
const doctorRouter = require("./routes/doctor/account");
const consultationDoctorRouter = require("./routes/doctor/consultation");
const prescriptionDocRouter = require("./routes/doctor/prescription");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vld.ubdyq.mongodb.net/VLD?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB connected!");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(cors());
app.use(express());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

//User routes
app.use("/api/user/auth", authUserRouter);
app.use("/api/user", userRouter);
app.use("/api/user/account", accountUserRouter);
app.use("/api/home", homepageRouter);
app.use("/api/user/consultation", consultationUserRouter);
app.use("/api/user/prescription", prescriptionRouter);
app.use("/api/admin/department", departmentRouter);
app.use("/api/admin/article", articleRouter);
app.use("/api/admin/doctor", doctoradminRouter);
app.use("/api/admin/product", productRouter);
app.use("/api/admin/notification", notificationRouter);
app.use("/api/doctor/account", doctorRouter);
app.use("/api/doctor/consultation", consultationDoctorRouter);
app.use("/api/doctor/prescription", prescriptionDocRouter);

app.get("/", (req, res) => res.send("VAN LANG DOCTOR SERVER OF TEAM 16"));

const PORT = process.env.PORT || 1210;

if ((process.env.NODE_ENV = "production")) {
  app.use(express.static("client/build"));
}

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
