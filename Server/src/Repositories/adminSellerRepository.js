/**
 * Author : Pinki
 * 
 * Admin Module
 * Database queries for fetching sellers and updating
 * seller account status.
 */

class AdminSellerRepository {

    // Get All Sellers.
    async getAllSellers(connection) {
        const query = `
        SELECT 
            id,
            seller_name,
            email,
            mobile,
            gstin,
            account_status,
            created_at
        FROM sellers
        ORDER BY created_at DESC`;

        const [rows] = await connection.query(query);

        return rows;
    }

    // Get Seller By Id.
    async getSellerById(connection, sellerId) {
        const query = `
        SELECT 
            id,
            seller_name,
            email,
            mobile,
            gstin,
            account_status,
            created_at
        FROM sellers
        WHERE id = ?`;

        const [rows] = await connection.query(query, [sellerId]);

        return rows[0];
    }

    // Update Seller Status.
    async updateSellerStatus(connection, sellerId, status) {
        const query = `
        UPDATE sellers
        SET account_status = ?
        WHERE id = ?`;

        const [result] = await connection.query(query, [status, sellerId]);

        return result;
    }

    // Check Seller Exists.
    async checkSellerExists(connection, sellerId) {
        const query = `
        SELECT 
            id,
            account_status
        FROM sellers 
        WHERE id = ?`;

        const [rows] = await connection.query(query, [sellerId]);

        return rows[0];


    }
}

module.exports = new AdminSellerRepository();