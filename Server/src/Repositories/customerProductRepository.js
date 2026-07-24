/**
 * Author Nishtha
 * 
 * Customer Module
 * Handles database operations related to customer products,
 * including retrieving products, searching products,
 * and fetching category information.
 */

const db = require("../Config/dbConnection");

class CustomerProductRepository {

    // Fetch all active products.
    async getAllProducts() {
        const sql = `
            SELECT
                p.*,
                pi.image_url
            FROM products p
                LEFT JOIN product_images pi
                ON p.id = pi.product_id
            WHERE p.status = 'ACTIVE'
            ORDER BY p.created_at DESC
            `;

        const [result] = await db.query(sql);
        return result;
    }

    // Get a single active product by its ID.
    async getProductById(productId) {
        const sql = `
            SELECT
                p.*,
                pi.image_url
            FROM products p
                LEFT JOIN product_images pi
                ON p.id = pi.product_id
            WHERE p.id = ?
            AND p.status = 'ACTIVE'
            
        `;

        const [rows] = await db.query(sql, [productId]);
        return rows;
    }

    // Search products by title.
    async searchProducts(keyword) {
        const sql = `
            SELECT
                p.*,
                pi.image_url
            FROM products p
                LEFT JOIN product_images pi
                ON p.id = pi.product_id
            WHERE p.title LIKE ?
            AND p.status = 'ACTIVE'
            ORDER BY p.created_at DESC
        `;

        const [rows] = await db.query(sql, [`%${keyword}%`]);
        return rows;
    }

    // Get all active products belonging to a category.
    async getProductsByCategory(categoryId) {
        const sql = `
            SELECT
                p.*,
                pi.image_url
            FROM products p
                LEFT JOIN product_images pi
                ON p.id = pi.product_id
            WHERE p.category_id = ?
            AND p.status = 'ACTIVE'
            ORDER BY p.created_at DESC
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