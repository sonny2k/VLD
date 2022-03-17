const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
  consultation: {
    type: Schema.Types.ObjectId,
    ref: "consultations",
  },
  medicines: new Schema({
    quantity: Number,
    morningrate: String,
    noonrate: String,
    everate: String,
    specdes: String,
    product: Schema.Types.ObjectId,
  }),
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
