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

router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  clientController.updateClient
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  clientController.deleteClient
);

module.exports = router;
