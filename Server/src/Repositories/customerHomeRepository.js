/** 
 * Author : Nishtha 
 *  
 * Customer Module 
 * Handles database operations for the customer home page, 
 * including retrieving categories, featured products, and new arrivals. 
 */ 
 
const db = require("../Config/dbConnection"); 
 
class CustomerHomeRepository { 
 
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
            p.id, 
            p.category_id, 
            p.title, 
            p.brand, 
            p.price, 
            p.discount_price,
            pi.image_url
        FROM products p
        LEFT JOIN product_images pi
            ON p.id = pi.product_id
        WHERE p.status = 'ACTIVE' 
        LIMIT 8`; 
 
        const [rows] = await db.query(sql); 
        return rows; 
    } 
 
    // Fetch the latest products added to the store. 
    async getNewArrivals() { 
        const sql = ` 
        SELECT 
            p.id, 
            p.category_id, 
            p.title, 
            p.brand, 
            p.price, 
            p.discount_price, 
            p.created_at,
            pi.image_url
        FROM products p
        LEFT JOIN product_images pi
            ON p.id = pi.product_id
        WHERE p.status = 'ACTIVE' 
        ORDER BY p.created_at DESC 
        LIMIT 8`; 
 
        const [rows] = await db.query(sql); 
        return rows; 
    } 
} 
 
module.exports = new CustomerHomeRepository();