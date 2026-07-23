/**
 * Author : Nishtha
 *
 * Customer Review Routes
 * Handles customer review operations including
 * adding, viewing, updating, and deleting reviews.
 */

const express = require("express");
const router = express.Router();

const customerReviewController = require("../controllers/customerReviewController");
const authenticateCustomer = require("../middleware/authMiddleware");

// Add a review for a product.
router.post("/", authenticateCustomer, customerReviewController.addReview);

// Get all reviews of a product.
router.get(
    "/:productId",
    authenticateCustomer,
    customerReviewController.getReviews,
);

// Update an existing review.
router.put(
    "/:reviewId",
    authenticateCustomer,
    customerReviewController.updateReview,
);

// Delete a review.
router.delete(
    "/:reviewId",
    authenticateCustomer,
    customerReviewController.deleteReview,
);

module.exports = router;