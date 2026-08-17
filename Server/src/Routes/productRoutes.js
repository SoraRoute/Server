/**
 * Author : Pinki
 *
 * Seller Product Routes
 * Handles seller product management including
 * adding, viewing, updating, deleting, and changing product status.
 */

const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware")

const roleMiddleware = require("../middleware/roleMiddleware")

const upload = require("../middleware/uploadMiddleware");

const validationMiddleware = require("../middleware/validationMiddleware");

const {
    addProductValidation
} = require("../middleware/productValidation");

// Add a new product
router.post("/add", authMiddleware,
    roleMiddleware("seller"),
    upload.array("images", 5),
    addProductValidation,
    validationMiddleware,
    productController.addProduct
);

// Get all products of the logged-in seller
router.get("/my-products", authMiddleware,
    roleMiddleware("seller"),
    productController.getSellerProducts
);

// Get product details by ID
router.get("/:id", authMiddleware,
    roleMiddleware("seller"),
    productController.getProductById
);

// Update product details
router.put("/:id", authMiddleware,
    roleMiddleware("seller"),
    productController.updateProduct
);

// Add/remove images on an existing product (the "Edit Images" action)
router.patch("/:id/images", authMiddleware,
    roleMiddleware("seller"),
    upload.array("images", 5),
    productController.updateProductImages
);

// Delete a product
router.delete("/:id", authMiddleware,
    roleMiddleware("seller"),
    productController.deleteProduct
);

// Update product status
router.patch("/:id/status", authMiddleware,
    roleMiddleware("seller"),
    productController.updateStatus
)

module.exports = router;
