/**
 * Author: Nishtha
 * 
 * Customer Module
 * Handles customer review operations including creating,
 * retrieving, updating, and deleting product reviews.
 */

const customerReviewService = require("../Services/customerReviewService");

class CustomerReviewController {

    // Add a review for a product.
    async addReview(req, res) {
        try {
            const result = await customerReviewService.addReview(
                req.user.customerId,
                req.body.productId,
                req.body.rating,
                req.body.comment,
            );

            return res.status(201).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get all reviews of a product.
    async getReviews(req, res) {
        try {
            const result = await customerReviewService.getReviews(
                req.params.productId,
            );

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Update an existing review.
    async updateReview(req, res) {
        try {
            const result = await customerReviewService.updateReview(
                req.user.customerId,
                req.params.reviewId,
                req.body.rating,
                req.body.comment,
            );

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Delete a review.
    async deleteReview(req, res) {
        try {
            const result = await customerReviewService.deleteReview(
                req.user.customerId,
                req.params.reviewId,
            );

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new CustomerReviewController();