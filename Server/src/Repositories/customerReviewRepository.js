const db = require("../Config/dbConnection");

class CustomerReviewRepository {
  // Author: Nishtha
  // Add a new review for a product.
  async addReview(userId, productId, rating, comment) {
    const sql = `
      INSERT INTO reviews
      (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      userId,
      productId,
      rating,
      comment,
    ]);

    return result.insertId;
  }

  // Check if the customer has already reviewed the product.
  async getReviewByUserAndProduct(userId, productId) {
    const sql = `
      SELECT *
      FROM reviews
      WHERE user_id=? AND product_id=?`;

    const [result] = await db.query(sql, [userId, productId]);
    return result[0];
  }

  // Get all reviews for a specific product.
  async getReviewsByProductId(productId) {
    const sql = `
      SELECT *
      FROM reviews
      WHERE product_id=?`;

    const [result] = await db.query(sql, [productId]);
    return result;
  }

  // Fetch a review using its ID.
  async getReviewById(reviewId) {
    const sql = `
      SELECT *
      FROM reviews
      WHERE id=?`;

    const [result] = await db.query(sql, [reviewId]);
    return result[0];
  }

  // Update an existing review.
  async updateReview(reviewId, rating, comment) {
    const sql = `
      UPDATE reviews
      SET rating=?, comment=?
      WHERE id=?`;

    const [result] = await db.query(sql, [rating, comment, reviewId]);
    return result.affectedRows;
  }

  // Delete a review.
  async deleteReview(reviewId) {
    const sql = `
      DELETE FROM reviews
      WHERE id=?`;

    const [result] = await db.query(sql, [reviewId]);
    return result.affectedRows;
  }
}

module.exports = new CustomerReviewRepository();