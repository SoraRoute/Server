/**
 * Author : Nishtha
 * 
 * AI Module
 * Handles database operations related to AI features,
 * including retrieving product data for AI-powered recommendations.
 */

const db = require("../Config/dbConnection");

class aiRepository {
    // Fetch all active products with category details
    // so the AI service can use them for recommendations.
    async getProductsForAI() {
        const sql = `
        SELECT
            p.id,
            p.title,
            p.brand,
            c.name AS category,
            p.description,
            p.price,
            p.discount_price
        FROM products p
        LEFT JOIN categories c
            ON p.category_id = c.id
        WHERE p.status = 'ACTIVE'
        `;

        // Execute query and return product data
        const [rows] = await db.query(sql);
        return rows;
    }
}

module.exports = new aiRepository();