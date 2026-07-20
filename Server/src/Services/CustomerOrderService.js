const customerOrderRepository = require("../Repositories/customerOrderRepository");
const customerRepository = require("../Repositories/customerRepository");
const customerCartRepository = require("../Repositories/customercartRepository");

class CustomerOrderService {
  // Author: Nishtha
  // Create an order using the products currently in the cart.
  async placeOrder(customerId) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const cart = await customerCartRepository.getCartByUserId(customerId);

    if (!cart) {
      throw new Error("Cart is empty");
    }

    const cartProducts = await customerCartRepository.getCartProducts(cart.id);

    if (cartProducts.length === 0) {
      throw new Error("Cart is empty");
    }

    // Calculate the total order amount.
    let totalAmount = 0;

    for (const item of cartProducts) {
      totalAmount += item.price * item.quantity;
    }

    // Create the order record.
    const orderId = await customerOrderRepository.createOrder(
      customerId,
      totalAmount,
    );

    // Save each product as an order item.
    for (const item of cartProducts) {
      await customerOrderRepository.createOrderItem(
        orderId,
        item.id,
        item.quantity,
        item.price,
      );
    }

    // Clear the cart after placing the order.
    await customerCartRepository.clearCart(cart.id);

    return {
      success: true,
      message: "Order placed successfully",
      orderId,
    };
  }

  // Get all orders placed by the customer.
  async getOrders(customerId) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const orders = await customerOrderRepository.getOrdersByUserId(customerId);

    return {
      success: true,
      orders,
    };
  }

  // Get a specific order after verifying ownership.
  async getOrderById(customerId, orderId) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const orders = await customerOrderRepository.getOrderById(orderId);

    if (!orders) {
      throw new Error("Order not found");
    }

    if (orders.user_id !== customerId) {
      throw new Error("Unauthorized");
    }

    return {
      success: true,
      orders,
    };
  }

  // Cancel an existing order.
  async cancelOrder(customerId, orderId) {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const order = await customerOrderRepository.getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.user_id !== customerId) {
      throw new Error("Unauthorized");
    }

    if (order.order_status === "CANCELLED") {
      throw new Error("Order already cancelled");
    }

    const rowsUpdated = await customerOrderRepository.cancelOrder(orderId);

    if (rowsUpdated === 0) {
      throw new Error("Failed to cancel order");
    }

    return {
      success: true,
      message: "Order cancelled successfully",
    };
  }
}

module.exports = new CustomerOrderService();