require("dotenv").config();
const express = require("express");
const cors = require("cors");
const knex = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const clientRoutes = require("./src/routes/clientRoutes");
const articleRoutes = require("./src/routes/articleRoutes");
const purchaseRoutes = require("./src/routes/purchaseRoutes");
const warehouseRoutes = require("./src/routes/warehouseRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
knex
  .raw("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/warehouse", warehouseRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
