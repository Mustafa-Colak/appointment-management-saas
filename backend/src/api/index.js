const express = require("express");
const router = express.Router();

// API Routes
const authRoutes = require("./v1/auth");
const tenantRoutes = require("./v1/tenants");
const userRoutes = require("./v1/users");
const appointmentRoutes = require("./v1/appointments");
const customerRoutes = require("./v1/customers");
const serviceRoutes = require("./v1/services");
const staffRoutes = require("./v1/staff");
const paymentRoutes = require("./v1/payments");
const productRoutes = require("./v1/products");
const reportRoutes = require("./v1/reports");

// Route tanımlamaları
router.use("/auth", authRoutes);
router.use("/tenants", tenantRoutes);
router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/customers", customerRoutes);
router.use("/services", serviceRoutes);
router.use("/staff", staffRoutes);
router.use("/payments", paymentRoutes);
router.use("/products", productRoutes);
router.use("/reports", reportRoutes);

module.exports = router;