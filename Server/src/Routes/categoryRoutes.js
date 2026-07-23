/**
 * Author : Pinki
 *
 * Category Routes
 * Handles category management for admins and
 * category retrieval for customers.
 */

const express = require("express");

const CategoryController = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const validationMiddleware = require("../middleware/validationMiddleware");

const {
    addCategoryValidation,
    updateCategoryValidation,
    changeCategoryStatusValidation
} = require("../middleware/categoryValidation");

const router = express.Router();

// Add a new category
router.post("/", authMiddleware,
    roleMiddleware("admin"),
    addCategoryValidation,
    validationMiddleware,
    CategoryController.addCategory
);

// Get all active categories for customers
router.get("/customer", CategoryController.getAllCategoriesForCustomer);

// Get all categories for admin
router.get("/admin",
    authMiddleware,
    roleMiddleware("admin"),
    CategoryController.getAllCategoriesForAdmin
);

// Get category by ID
router.get("/:id", CategoryController.getCategoryById);

// Update category details
router.put("/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateCategoryValidation,
    validationMiddleware,
    CategoryController.updateCategory
);

// Delete a category
router.delete("/:id",
    authMiddleware,
    roleMiddleware("admin"),
    CategoryController.deleteCategory
);

// Change category status
router.patch("/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    changeCategoryStatusValidation,
    validationMiddleware,
    CategoryController.changeCategoryStatus
);

module.exports = router;