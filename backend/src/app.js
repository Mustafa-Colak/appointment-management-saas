// Backend Ana Uygulama
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");
const apiRoutes = require("./api");

// Environment variables
require("dotenv").config();

// MongoDB bağlantısı
require("./config/database");

// Express uygulaması oluştur
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/v1", apiRoutes);

// Ana route
app.get("/", (req, res) => {
  res.json({
    message: "Randevu Yönetim Sistemi API",
    status: "active",
    timestamp: new Date()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route bulunamadı" });
});

// Hata yönetimi
app.use(errorHandler);

module.exports = app;