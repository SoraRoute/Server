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
            (
                SELECT pi.image_url
                FROM product_images pi
                WHERE pi.product_id = p.id
                ORDER BY pi.id ASC
                LIMIT 1
            ) AS image_url
        FROM products p
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
            (
                SELECT pi.image_url
                FROM product_images pi
                WHERE pi.product_id = p.id
                ORDER BY pi.id ASC
                LIMIT 1
            ) AS image_url
        FROM products p
        WHERE p.status = 'ACTIVE' 
        ORDER BY p.created_at DESC 
        LIMIT 8`; 
 
        const [rows] = await db.query(sql); 
        return rows; 
    } 
} 
 
module.exports = new CustomerHomeRepository();