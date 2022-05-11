const express = require("express");
const router = express.Router();
const Supplier = require("../../models/Supplier");
const verifyToken = require("../../middleware/auth");

//GET ALL SUPPLIERS
router.get("/viewSupplier", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
