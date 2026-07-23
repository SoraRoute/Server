/**
 * Author : Pinki
 *
 * Admin Product Routes
 * Handles product management operations for admins,
 * including viewing, approving/rejecting, and deleting products.
 */

const express = require("express");
const router = express.Router();

const AdminProductController = require("../controllers/adminProductController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/**
 * GET /products
 * Fetch all products for admin review.
 */
router.get(
    "/products",
    authMiddleware,
    roleMiddleware("admin"),
    AdminProductController.getAllProducts
)

/**
 * GET /products/:productId
 * Fetch details of a specific product by its ID.
 */
router.get(
    "/products/:productId",
    authMiddleware,
    roleMiddleware("admin"),
    AdminProductController.getProductById
)

/**
 * PATCH /products/:productId/status
 * Update the approval/status of a product.
 */
router.patch(
    "/products/:productId/status",
    authMiddleware,
    roleMiddleware("admin"),
    AdminProductController.updateProductStatus
)

/**

 * Permanently remove a product from the system.
 */
router.delete(
    "/products/:productId",
    authMiddleware,
    roleMiddleware("admin"),
    AdminProductController.deleteProduct
)

module.exports = router;