const express = require("express");
const router = express.Router();

const customerProductController = require("../controllers/customerProductController");


// Author: Nishtha

// Get all available products.
router.get("/", customerProductController.getAllProducts);

// Search products by keyword.
router.get("/search", customerProductController.searchProducts);

// Get products belonging to a specific category.
router.get(
  "/category/:categoryId",
  customerProductController.getProductsByCategory,
);

// Get details of a specific product.
router.get("/:productId", customerProductController.getProductById);

module.exports = router;