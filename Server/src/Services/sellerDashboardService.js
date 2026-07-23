/**
 * Seller Module
 *
 * Author : Pinki
 * Business logic for the seller dashboard: summary counts,
 * product statistics, recent products, and category breakdown.
 */


const db = require("../Config/dbConnection")

const sellerDashboardRepository = require("../Repositories/sellerDashboardRepository");

class SellerDashboardService {

    // Get Dashboard Summary.
    async getDashboardSummary(sellerId) {
        const connection = await db.getConnection();
        try {
            const result = await sellerDashboardRepository.getDashboardSummary(connection, sellerId);

            return {
                success: true,
                message: "Dashboard summary fetched succesfully.",
                data: result
            }

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    // Get Product Statistics.
    async getProductStatistics(sellerId) {
        const connection = await db.getConnection();
        try {
            const result = await sellerDashboardRepository.getProductStatistics(connection, sellerId);

            return {
                success: true,
                message: "Product summary fetched succesfully.",
                data: result
            }

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    // Get Recent Products.
    async getRecentProducts(sellerId) {
        const connection = await db.getConnection();
        try {
            const result = await sellerDashboardRepository.getRecentProducts(connection, sellerId);

            return {
                success: true,
                message: "Recent Products fetched succesfully.",
                data: result
            }

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }

    // Get Category Wise Product Count.
    async getCategoryWiseProductCount(sellerId) {
        const connection = await db.getConnection();
        try {
            const result = await sellerDashboardRepository.getCategoryWiseProductCount(connection, sellerId);

            return {
                success: true,
                message: "Category wise count fetched succesfully.",
                data: result
            }

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }
}

module.exports = new SellerDashboardService();