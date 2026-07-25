/**
 * Author : Nishtha
 *
 * Customer Wishlist Routes
 * Handles customer wishlist operations including
 * adding, viewing, and removing wishlist items.
 */

const express = require("express");
const router = express.Router();

const customerWishlistController = require("../controllers/customerWishlistController");
const authenticateCustomer = require("../middleware/authMiddleware");

// Add a product to the wishlist.
router.post(
    "/:productId",
    authenticateCustomer,
    customerWishlistController.addToWishlist,
);

// Get all wishlist items.
router.get("/", authenticateCustomer, customerWishlistController.getWishlist);

// Remove a product from the wishlist.
router.delete(
    "/:productId",
    authenticateCustomer,
    customerWishlistController.removeFromWishlist,
);

module.exports = router;