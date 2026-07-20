const db = require("../Config/dbConnection");

class CustomerHomeRepository {
  // Author: Nishtha
  // Fetch all available product categories.
  async getCategories() {
    const sql = `
      SELECT
        id,
        name,
        description
      FROM categories
      ORDER BY name ASC`;

    const [rows] = await db.query(sql);
    return rows;
  }

  // Get featured products to display on the home page.
  async getFeaturedProducts() {
    const sql = `
      SELECT
        id,
        category_id,
        title,
        brand,
        price,
        discount_price
      FROM products
      WHERE status = 'ACTIVE'
      LIMIT 8`;

    const [rows] = await db.query(sql);
    return rows;
  }

  // Fetch the latest products added to the store.
  async getNewArrivals() {
    const sql = `
      SELECT
        id,
        category_id,
        title,
        brand,
        price,
        discount_price,
        created_at
      FROM products
      WHERE status = 'ACTIVE'
      ORDER BY created_at DESC
      LIMIT 8`;

    const [rows] = await db.query(sql);
    return rows;
  }
}

module.exports = new CustomerHomeRepository();