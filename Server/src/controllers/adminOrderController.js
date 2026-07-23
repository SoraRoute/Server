/**
 * Author : Pinki
 * 
 * Admin Module
 * Handles HTTP requests for viewing all orders and updating
 * order status from the admin panel.
 */

const adminOrderService = require("../Services/adminOrderService");

class AdminOrderController {

    //Get All Orders.
    async getAllOrders(req, res) {
        try {

            const result = await adminOrderService.getAllOrders();

            return res.status(200).json(result);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    // Get Order By Id.
    async getOrderById(req, res) {
        try {

            const { orderId } = req.params;

            const result = await adminOrderService.getOrderById(orderId);

            return res.status(200).json(result);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    // Update Order Status.
    async updateOrderStatus(req, res) {
        try {

            const { orderId } = req.params;
            const { order_status } = req.body;

            const result = await adminOrderService.updateOrderStatus(
                orderId,
                order_status
            );

            return res.status(200).json(result);

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }
}

module.exports = new AdminOrderController();