/**
 * Author : Pinki
 *
 * Seller Authentication & Management Routes
 * Handles seller authentication, profile management,
 * password operations, orders, revenue, and logout.
 */

const express = require("express");
const router = express.Router();

const sellerController = require("../controllers/sellerController");

const authMiddleware = require("../middleware/authMiddleware")

const roleMiddleware = require("../middleware/roleMiddleware")

const validateSellerProfile = require("../middleware/validationSellerProfile")

const validateChangePassword = require("../middleware/validationChangePassword")

// Send OTP for seller registration
router.post(
    "/send-otp",
    sellerController.sendSellerOtp
);

// Verify seller OTP
router.post(
    "/verify-otp",
    sellerController.verifySellerOtp
);

// Register a new seller
router.post(
    "/register",
    sellerController.registerSeller
);

// Seller login
router.post(
    "/login",
    sellerController.loginSeller
);

// Get seller profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("seller"),
    sellerController.getSellerProfile
);

// Send OTP for password reset
router.post(
    "/forgot-password",
    sellerController.forgotPassword
);

// Reset seller password
router.post(
    "/reset-password",
    sellerController.resetPassword
);

// Update seller profile
router.patch(
    "/update-profile",
    authMiddleware,
    roleMiddleware("seller"),
    validateSellerProfile,
    sellerController.updateSellerProfile
);

// Change seller password
router.patch(
    "/change-password",
    authMiddleware,
    roleMiddleware("seller"),
    validateChangePassword,
    sellerController.changePassword
);


// Seller Orders
router.get(
    "/orders",
    authMiddleware,
    roleMiddleware("seller"),
    sellerController.getSellerOrders
);

// Seller Revenue
router.get(
    "/revenue",
    authMiddleware,
    roleMiddleware("seller"),
    sellerController.getSellerRevenue
);

// Update Order Status
router.patch(
    "/orders/:orderId/status",
    authMiddleware,
    roleMiddleware("seller"),
    sellerController.updateOrderStatus
);
// Logout seller
router.post("/logout", 
    authMiddleware, 
    sellerController.logout
);

module.exports = router;
