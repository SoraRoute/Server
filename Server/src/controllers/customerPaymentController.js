const customerPaymentService = require("../Services/customerPaymentService");

class CustomerPaymentController {
  // Author: Nishtha
  // Process payment for a customer order.
  async makePayment(req, res) {
    try {
      const result = await customerPaymentService.makePayment(
        req.user.customerId,
        req.body.orderId,
        req.body.paymentMethod,
      );

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get payment details for a specific order.
  async getPayment(req, res) {
    try {
      const result = await customerPaymentService.getPayment(
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

module.exports = new CustomerPaymentController();