const db = require("../Config/dbConnection");

class CustomerWishlistRepository {
  // Author: Nishtha
  // Create a wishlist for a new customer.
  async createWishlist(userId) {
    const sql = `
      INSERT INTO wishlists (user_id)
      VALUES (?)`;

    const [result] = await db.query(sql, [userId]);
    return result.insertId;
  }

  // Get the wishlist associated with a customer.
  async getWishlistByUserId(userId) {
    const sql = `
      SELECT *
      FROM wishlists
      WHERE user_id=?
      LIMIT 1`;

    const [rows] = await db.query(sql, [userId]);
    return rows[0];
  }

  // Check if a product is already in the wishlist.
  async findWishlistItem(wishlistId, productId) {
    const sql = `
      SELECT *
      FROM wishlist_items
      WHERE wishlist_id=?
        AND product_id=?
      LIMIT 1`;

    const [rows] = await db.query(sql, [wishlistId, productId]);
    return rows[0];
  }

  // Add a product to the wishlist.
  async addProductToWishlist(wishlistId, productId) {
    const sql = `
      INSERT INTO wishlist_items
      (wishlist_id, product_id)
      VALUES (?, ?)`;

    const [result] = await db.query(sql, [wishlistId, productId]);
    return result.insertId;
  }

  // Get all products saved in the wishlist.
  async getWishlistProducts(wishlistId) {
    const sql = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.brand,
        p.price,
        p.discount_price,
        p.status
      FROM wishlist_items wi
      JOIN products p
        ON wi.product_id = p.id
      WHERE wi.wishlist_id = ?
    `;

    const [rows] = await db.query(sql, [wishlistId]);
    return rows;
  }

  // Remove a product from the wishlist.
  async removeProductFromWishlist(wishlistId, productId) {
    const sql = `
      DELETE FROM wishlist_items
      WHERE wishlist_id=?
        AND product_id=?`;

    const [result] = await db.query(sql, [wishlistId, productId]);
    return result.affectedRows;
  }
}

module.exports = new CustomerWishlistRepository();