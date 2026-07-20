const express = require("express");

const router = express.Router();
const customerWishlistController = require("../controllers/customerWishlistController");
const authenticateCustomer = require("../middleware/authMiddleware");

// Author: Nishtha

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