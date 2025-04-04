const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const purchaseController = require("../controllers/purchaseController");

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  purchaseController.createPurchase
);
router.get("/", authenticate, purchaseController.getClientPurchases);

router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  purchaseController.updatePurchase
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  purchaseController.deletePurchase
);

module.exports = router;
