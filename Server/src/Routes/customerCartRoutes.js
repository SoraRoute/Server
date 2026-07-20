const express = require("express");
const router = express.Router();

const customerCartController = require("../controllers/customerCartController");
const authenticateCustomer = require("../middleware/authMiddleware");

// Author: Nishtha

// Add a product to the cart.
router.post(
  "/:productId",
  authenticateCustomer,
  customerCartController.addToCart,
);

// Get all cart items.
router.get("/", authenticateCustomer, customerCartController.getCart);

// Update the quantity of a cart item.
router.patch(
  "/:productId",
  authenticateCustomer,
  customerCartController.updateCartItem,
);

// Remove a product from the cart.
router.delete(
  "/:productId",
  authenticateCustomer,
  customerCartController.removeFromCart,
);

module.exports = router;