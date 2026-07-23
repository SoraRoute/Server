/**
 * Author : Pinki
 *
 * Seller Dashboard Routes
 * Handles seller dashboard data including summary,
 * product statistics, recent products, and category-wise counts.
 */

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const sellerDashboardController = require("../controllers/sellerDashboardController");

// Get dashboard summary
router.get("/",
    authMiddleware,
    roleMiddleware("seller"),
    sellerDashboardController.getDashboardSummary
)

// Get product statistics
router.get("/product-statistics",
    authMiddleware,
    roleMiddleware("seller"),
    sellerDashboardController.getProductStatistics
)

// Get recently added products
router.get("/recent-products",
    authMiddleware,
    roleMiddleware("seller"),
    sellerDashboardController.getRecentProducts
)

// Get category-wise product count
router.get("/category-wise-product-count",
    authMiddleware,
    roleMiddleware("seller"),
    sellerDashboardController.getCategoryWiseProductCount
)

module.exports = router;