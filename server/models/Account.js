const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  profilepic: {
    type: String,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
  },
  gender: {
    type: Number,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: new Schema({
    city: String,
    district: String,
    ward: String,
    street: String,
  }),
});

module.exports = mongoose.model("accounts", AccountSchema);
