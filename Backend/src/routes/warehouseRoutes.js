const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const warehouseController = require("../controllers/warehouseController");

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  warehouseController.createWarehouse
);
router.get("/", authenticate, warehouseController.getWarehouses);

module.exports = router;
