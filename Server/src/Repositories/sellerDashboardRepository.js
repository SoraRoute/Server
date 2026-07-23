/**
 * Author : Pinki
 * 
 * Seller Module
 * Database queries used to compute seller dashboard
 * statistics and summaries.
 */

class sellerDashboardRepository {

    // Get Dashboard Summary.
    async getDashboardSummary(connection, sellerId) {
        const query = `
            SELECT
                COUNT(id) AS totalProducts,

                COALESCE(SUM(CASE
                        WHEN status = 'ACTIVE' THEN 1
                        ELSE 0
                    END),0) AS activeProducts,

                COALESCE(SUM(CASE
                        WHEN status = 'INACTIVE' THEN 1
                        ELSE 0
                    END),0) AS inactiveProducts,

                COUNT(DISTINCT (category_id),0) AS totalCategories,

                COALESCE(SUM(stock),0) as totalStock

            FROM products
            WHERE seller_id = ?;
        `;

        const [rows] = await connection.query(query, [sellerId]);

        return rows[0];
    }


    // Get Product Statistics.
    async getProductStatistics(connection, sellerId) {
        const query = `SELECT COALESCE(SUM(stock),0) as totalStock,
        
        COALESCE(ROUND(AVG(price),2),0) as averagePrice,
        
        COALESCE(MAX(PRICE),0) as highestPrice,
        
        COALESCE(MIN(PRICE),0) as lowestPrice 
        
        FROM products WHERE seller_id = ? `;

        const [rows] = await connection.query(query, [sellerId]);

        return rows[0];

    }

    // Get Recent Products.
    async getRecentProducts(connection, sellerId) {
        const query = `
        SELECT 
            id,
            title,
            price,
            stock,
            status,
            created_at 
        FROM products 
        WHERE seller_id = ? 
        ORDER BY created_at DESC LIMIT 5`;

        const [rows] = await connection.query(query, [sellerId]);

        return rows;

    }


    // Get Category Wise Product Count.
    async getCategoryWiseProductCount(connection, sellerId) {
        const query = `
        SELECT
            c.name AS categoryName,
            COUNT(p.id) AS productCount

        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.id

        WHERE p.seller_id = ?
        GROUP BY c.id, c.name
        ORDER BY productCount DESC;
        `;

        const [rows] = await connection.query(query, [sellerId]);

        return rows;

    }
}

module.exports = new sellerDashboardRepository();