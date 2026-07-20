const db = require("../Config/dbConnection");

class CustomerCartRepository {
  // Author: Nishtha
  // Create a cart for a new customer.
  async createCart(userId) {
    const sql = `
      INSERT INTO carts (user_id)
      VALUES (?)`;

    const [result] = await db.query(sql, [userId]);
    return result.insertId;
  }

  // Add a product to the customer's cart.
  async addProductToCart(cartId, productId, quantity) {
    const sql = `
      INSERT INTO cart_items
      (cart_id, product_id, quantity)
      VALUES (?,?,?)`;

    const [result] = await db.query(sql, [cartId, productId, quantity]);
    return result.insertId;
  }

  // Fetch the cart associated with a customer.
  async getCartByUserId(userId) {
    const sql = `
      SELECT *
      FROM carts
      WHERE user_id=?
      LIMIT 1`;

    const [rows] = await db.query(sql, [userId]);
    return rows[0];
  }

  // Check if a product already exists in the cart.
  async findCartItem(cartId, productId) {
    const sql = `
      SELECT *
      FROM cart_items
      WHERE cart_id=? AND product_id=?
      LIMIT 1`;

    const [rows] = await db.query(sql, [cartId, productId]);
    return rows[0];
  }

  // Get all products currently added to the cart.
  async getCartProducts(cartId) {
    const sql = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.brand,
        p.price,
        p.discount_price,
        p.status,
        ci.quantity
      FROM cart_items ci
      JOIN products p
        ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `;

    const [rows] = await db.query(sql, [cartId]);
    return rows;
  }

  // Update the quantity of a product in the cart.
  async updateCartItemQuantity(cartId, productId, quantity) {
    const sql = `
      UPDATE cart_items
      SET quantity=?
      WHERE cart_id=?
      AND product_id=?`;

    const [result] = await db.query(sql, [quantity, cartId, productId]);
    return result.affectedRows;
  }

  // Remove a specific product from the cart.
  async removeProductFromCart(cartId, productId) {
    const sql = `
      DELETE FROM cart_items
      WHERE cart_id=? AND product_id=?`;

    const [result] = await db.query(sql, [cartId, productId]);
    return result.affectedRows;
  }

  // Remove all products from the cart.
  async clearCart(cartId) {
    const sql = `
      DELETE FROM cart_items
      WHERE cart_id = ?`;

    const [result] = await db.query(sql, [cartId]);
    return result.affectedRows;
  }
}

module.exports = new CustomerCartRepository();