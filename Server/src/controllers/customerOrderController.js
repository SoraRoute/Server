const customerOrderService = require("../Services/CustomerOrderService");

class CustomerOrderController {
  // Author: Nishtha
  // Place a new order for the customer.
  async placeOrder(req, res) {
    try {
      const result = await customerOrderService.placeOrder(req.user.customerId);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all orders of the logged-in customer.
  async getOrders(req, res) {
    try {
      const result = await customerOrderService.getOrders(req.user.customerId);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get details of a specific order.
  async getOrderById(req, res) {
    try {
      const result = await customerOrderService.getOrderById(
        req.user.customerId,
        req.params.orderId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Cancel an existing order.
  async cancelOrder(req, res) {
    try {
      const result = await customerOrderService.cancelOrder(
        req.user.customerId,
        req.params.orderId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CustomerOrderController();