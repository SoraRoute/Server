const db = require("../Config/dbConnection");

class CustomerOrderRepository {
  // Author: Nishtha
  // Create a new order for the customer.
  async createOrder(userId, totalAmount) {
    const sql = `
      INSERT INTO orders (user_id, total_amount, order_status)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [userId, totalAmount, "PLACED"]);
    return result.insertId;
  }

  // Save a product as part of an order.
  async createOrderItem(orderId, productId, quantity, price) {
    const sql = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      orderId,
      productId,
      quantity,
      price,
    ]);

    return result.insertId;
  }

  // Get all orders placed by a customer.
  async getOrdersByUserId(userId) {
    const sql = `
      SELECT *
      FROM orders
      WHERE user_id=?`;

    const [rows] = await db.query(sql, [userId]);
    return rows;
  }

  // Fetch a single order using its ID.
  async getOrderById(orderId) {
    const sql = `
      SELECT *
      FROM orders
      WHERE id=?`;

    const [rows] = await db.query(sql, [orderId]);
    return rows[0];
  }

  // Cancel an existing order.
  async cancelOrder(orderId) {
    const sql = `
      UPDATE orders
      SET order_status = 'CANCELLED'
      WHERE id=?`;

    const [result] = await db.query(sql, [orderId]);
    return result.affectedRows;
  }

  // Check if the customer has already purchased a product.
  async hasPurchasedProduct(customerId, productId) {
    const sql = `
      SELECT oi.id
      FROM orders o
      JOIN order_items oi
        ON o.id = oi.order_id
      WHERE o.user_id = ?
        AND oi.product_id = ?
        AND o.order_status != 'CANCELLED'
    `;

    const [rows] = await db.query(sql, [customerId, productId]);

    return rows.length > 0;
  }
}

module.exports = new CustomerOrderRepository();