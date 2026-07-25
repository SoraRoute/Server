/**
 * Author : Nishtha
 *
 * Customer Authentication Routes
 * Handles customer registration, authentication,
 * profile management, password recovery, and logout.
 */

const express = require("express");
const customerController = require("../controllers/customerController");
const authenticateCustomer = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new customer.
router.post("/register", customerController.registerCustomer);

// Verify customer email using OTP.
router.post("/verify-email", customerController.verifyEmail);

// Log in a customer.
router.post("/login", customerController.loginCustomer);

// Send OTP for password reset.
router.post("/forgot-password", customerController.forgotPassword);

// Reset the customer password.
router.post("/reset-password", customerController.resetPassword);

// Get the logged-in customer's profile.
router.get(
    "/profile",
    authenticateCustomer,
    customerController.getCustomerProfile,
);

// Update the logged-in customer's profile.
router.patch(
    "/profile",
    authenticateCustomer,
    customerController.updateCustomerProfile,
);

// Log out the customer.
router.post("/logout", authenticateCustomer, customerController.logout);

module.exports = router;