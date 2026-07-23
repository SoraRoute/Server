/**
 * Author : Nishtha
 *
 * Customer Payment Routes
 * Handles customer payment processing and
 * retrieval of payment details.
 */

const express = require("express");
const router = express.Router();

const customerPaymentController = require("../controllers/customerPaymentController");
const authenticateCustomer = require("../middleware/authMiddleware");

// Make payment for an order.
router.post("/", authenticateCustomer, customerPaymentController.makePayment);

// Get payment details for an order.
router.get(
    "/:orderId",
    authenticateCustomer,
    customerPaymentController.getPayment,
);

module.exports = router;