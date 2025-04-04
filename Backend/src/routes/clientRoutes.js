const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const clientController = require("../controllers/clientController");

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  clientController.createClient
);

router.get("/", authenticate, clientController.getClients);

router.get("/:id/purchases", authenticate, clientController.getClientPurchases);

// Add PUT and DELETE routes similarly

module.exports = router;
