/**
 * Author : Pinki
 * 
 * Seller Module
 * Exposes dashboard summary and product statistics endpoints
 * for the logged-in seller.
 */

const sellerDashboardService = require("../Services/sellerDashboardService");

class SellerDashboardController {

    // Get Dashboard Summary.
    async getDashboardSummary(req, res) {
        try {
            const sellerId = req.user.sellerId;

            const result = await sellerDashboardService.getDashboardSummary(sellerId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    // Get Product Statistics.
    async getProductStatistics(req, res) {
        try {
            const sellerId = req.user.sellerId;

            const result = await sellerDashboardService.getProductStatistics(sellerId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get Recent Products.
    async getRecentProducts(req, res) {
        try {
            const sellerId = req.user.sellerId;

            const result = await sellerDashboardService.getRecentProducts(sellerId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get Category Wise Product Count.
    async getCategoryWiseProductCount(req, res) {
        try {
            const sellerId = req.user.sellerId;

            const result = await sellerDashboardService.getCategoryWiseProductCount(sellerId);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new SellerDashboardController();