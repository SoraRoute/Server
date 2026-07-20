const db = require("../Config/dbConnection");

class CustomerProductRepository {
  // Author: Nishtha
  // Fetch all active products.
  async getAllProducts() {
    const sql = `
      SELECT *
      FROM products
      WHERE status = "ACTIVE"`;

    const [result] = await db.query(sql);
    return result;
  }

  // Get a single active product by its ID.
  async getProductById(productId) {
    const sql = `
      SELECT *
      FROM products
      WHERE id = ?
        AND status = 'ACTIVE'
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [productId]);
    return rows[0];
  }

  // Search products by title.
  async searchProducts(keyword) {
    const sql = `
      SELECT *
      FROM products
      WHERE title LIKE ?
        AND status = "ACTIVE"
    `;

    const [rows] = await db.query(sql, [`%${keyword}%`]);
    return rows;
  }

  // Get all active products belonging to a category.
  async getProductsByCategory(categoryId) {
    const sql = `
      SELECT *
      FROM products
      WHERE category_id = ?
        AND status = "ACTIVE"
    `;

    const [rows] = await db.query(sql, [categoryId]);
    return rows;
  }

  // Check if a category exists and fetch its details.
  async findCategoryById(categoryId) {
    const sql = `
      SELECT *
      FROM categories
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [categoryId]);
    return rows[0];
  }
}

module.exports = new CustomerProductRepository();