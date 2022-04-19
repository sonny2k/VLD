const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const med = new Schema({
  quantity: String,
  morningrate: String,
  noonrate: String,
  everate: String,
  specdes: String,
  product: {
    type: Schema.Types.ObjectId,
    ref: "products"
  }
})

const PrescriptionSchema = new Schema({
  consultation: {
    type: Schema.Types.ObjectId,
    ref: "consultations",
  },
  medicines: [med],
  pname: {
    type: String,
  },
  diagnosis: {
    type: String,
  },
  note: {
    type: String,
  },
});
module.exports = mongoose.model("prescriptions", PrescriptionSchema);