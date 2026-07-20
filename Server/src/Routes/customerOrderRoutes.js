const express = require("express");
const router = express.Router();

const customerOrderController = require("../controllers/customerOrderController");
const authenticateCustomer = require("../middleware/authMiddleware");

// Author: Nishtha

// Place a new order.
router.post("/", authenticateCustomer, customerOrderController.placeOrder);

// Get all customer orders.
router.get("/", authenticateCustomer, customerOrderController.getOrders);

// Get a specific order by ID.
router.get(
  "/:orderId",
  authenticateCustomer,
  customerOrderController.getOrderById,
);

// Cancel an existing order.
router.delete(
  "/:orderId/cancel",
  authenticateCustomer,
  customerOrderController.cancelOrder,
);

module.exports = router;