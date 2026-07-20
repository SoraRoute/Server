const customerReviewRepository = require("../Repositories/customerReviewRepository");
const customerRepository = require("../Repositories/customerRepository");
const customerOrderRepository = require("../Repositories/customerOrderRepository");
const productRepository = require("../Repositories/productRepository");

class CustomerReviewService {
  // Author: Nishtha
  // Add a review for a purchased product.
  async addReview(customerId, productId, rating, comment) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const product = await productRepository.findProductById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // Allow reviews only for purchased products.
    const purchased = await customerOrderRepository.hasPurchasedProduct(
      customerId,
      productId,
    );

    if (!purchased) {
      throw new Error("You can review only purchased products");
    }

    // Prevent duplicate reviews.
    const existingReview =
      await customerReviewRepository.getReviewByUserAndProduct(
        customerId,
        productId,
      );

    if (existingReview) {
      throw new Error("Review already exists");
    }

    const reviewId = await customerReviewRepository.addReview(
      customerId,
      productId,
      rating,
      comment,
    );

    return {
      success: true,
      message: "Review added successfully",
      reviewId,
    };
  }

  // Get all reviews for a product.
  async getReviews(productId) {
    const product = await productRepository.findProductById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const reviews =
      await customerReviewRepository.getReviewsByProductId(productId);

    return {
      success: true,
      reviews,
    };
  }

  // Update an existing review.
  async updateReview(customerId, reviewId, rating, comment) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const review = await customerReviewRepository.getReviewById(reviewId);

    if (!review) {
      throw new Error("No review found");
    }

    // Ensure the review belongs to the customer.
    if (review.user_id !== customerId) {
      throw new Error("Unauthorized");
    }

    await customerReviewRepository.updateReview(
      reviewId,
      rating,
      comment,
    );

    return {
      success: true,
      message: "Review updated successfully",
    };
  }

  // Delete a customer's review.
  async deleteReview(customerId, reviewId) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const review = await customerReviewRepository.getReviewById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    // Ensure the review belongs to the customer.
    if (review.user_id !== customerId) {
      throw new Error("Unauthorized");
    }

    await customerReviewRepository.deleteReview(reviewId);

    return {
      success: true,
      message: "Review deleted successfully",
    };
  }
}

module.exports = new CustomerReviewService();