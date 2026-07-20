const customerPaymentReporsitory = require("../Repositories/customerPaymentRepository");
const customerRepository = require("../Repositories/customerRepository");
const customerOrderRepository = require("../Repositories/customerOrderRepository");

class CustomerPaymentService {
  // Author: Nishtha
  // Process payment for a customer's order.
  async makePayment(customerId, orderId, paymentMethod) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const order = await customerOrderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify that the order belongs to the customer.
    if (order.user_id !== customerId) {
      throw new Error("Unauthorized");
    }

    if (order.order_status === "CANCELLED") {
      throw new Error("Cannot pay for a cancelled order");
    }

    // Prevent duplicate payments for the same order.
    const payment =
      await customerPaymentReporsitory.getPaymentByOrderId(orderId);

    if (payment) {
      throw new Error("Payment already exists");
    }

    // COD remains pending, while online payments are marked successful.
    let paymentStatus = paymentMethod === "COD" ? "PENDING" : "SUCCESS";

    let transactionId = null;

    // Generate a transaction ID for online payments.
    if (paymentMethod !== "COD") {
      transactionId = "TXN" + Date.now();
    }

    const paymentId = await customerPaymentReporsitory.createPayment(
      orderId,
      paymentMethod,
      paymentStatus,
      transactionId,
    );

    return {
      success: true,
      message: "Payment successful",
      paymentId,
    };
  }

  // Get payment details for a specific order.
  async getPayment(customerId, orderId) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const order = await customerOrderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify that the order belongs to the customer.
    if (order.user_id !== customerId) {
      throw new Error("Unauthorized");
    }

    const payment =
      await customerPaymentReporsitory.getPaymentByOrderId(orderId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return {
      success: true,
      payment,
    };
  }
}

module.exports = new CustomerPaymentService();