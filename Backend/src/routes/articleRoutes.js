const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const articleController = require("../controllers/articleController");

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  articleController.createArticle
);

router.get("/", authenticate, articleController.getArticles);

router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  articleController.updateArticle
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  articleController.deleteArticle
);

module.exports = router;
