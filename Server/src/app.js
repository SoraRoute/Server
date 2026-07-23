/**
 * Authors : Nishtha & Pinki
 *
 * MarketHive Backend - Express Application Setup
 * Configures middleware and registers all API routes
 * for seller, customer, admin, products, categories, and AI modules.
 */


// Load environment variables
require("dotenv").config();


const express = require("express");
const cors = require("cors");
const app = express();


// Enable CORS for frontend requests
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);


// Parse JSON request bodies
app.use(express.json());

const cookieParser = require("cookie-parser");

// Parse cookies
app.use(cookieParser());


// Import seller routes
const sellerRoutes = require("./Routes/sellerRoutes");
const sellerDashboardRoutes = require("./Routes/sellerDashboardRoutes");
const productRoutes = require("./Routes/productRoutes");


// Import customer routes
const customerRoutes = require("./Routes/customerRoutes");
const customerAddressRoutes = require("./Routes/customerAddressRoutes");
const customerWishlistRoutes = require("./Routes/customerWishlistRoutes");
const customerCartRoutes = require("./Routes/customerCartRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const customerOrderRoutes = require("./Routes/customerOrderRoutes");
const customerPaymentRoutes = require("./Routes/customerPaymentRoutes");
const customerReviewRoutes = require("./Routes/customerReviewRoutes");
const customerProductRoutes = require("./Routes/customerProductRoutes");
const customerHomeRoutes = require("./Routes/customerHomeRoutes");


// Import AI routes
const aiRoutes = require("./Routes/aiRoutes");


// Import admin routes
const adminRoutes = require("./Routes/adminRoutes");
const adminSellerRoutes = require("./Routes/adminSellerRoutes");
const adminProductRoutes = require("./Routes/adminProductRoutes");
const adminDashboardRoutes = require("./Routes/adminDashboardRoutes");
const adminOrderRoutes = require("./Routes/adminOrderRoutes");


// Register seller routes
app.use("/api/seller", sellerRoutes);
app.use("/api/seller/dashboard", sellerDashboardRoutes);


// Register product routes
app.use("/api/products", productRoutes);
app.use("/api/my-products", productRoutes);


// Register customer routes
app.use("/api/customers", customerRoutes);
app.use("/api/customer-addresses", customerAddressRoutes);
app.use("/api/customer-wishlist", customerWishlistRoutes);
app.use("/api/customer-cart", customerCartRoutes);
app.use("/api/customer-orders", customerOrderRoutes);
app.use("/api/customer-payments", customerPaymentRoutes);
app.use("/api/customer-reviews", customerReviewRoutes);
app.use("/api/customer-products", customerProductRoutes);
app.use("/api/customer-home", customerHomeRoutes);


// Register AI routes
app.use("/api/ai", aiRoutes);


// Serve uploaded files
app.use("/uploads", express.static("uploads"));


// Register category routes
app.use("/api/categories", categoryRoutes);


// Register admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/sellers", adminSellerRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


// Export Express application
module.exports = app;