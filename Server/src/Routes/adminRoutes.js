/**
 * Author : Pinki
 *
 * Admin Authentication Routes
 * Handles admin authentication, profile management,
 * password operations, and logout functionality.
 */

const express = require("express");

const AdminController = require("../Controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");

const loginValidator = require("../middleware/adminLoginValidation");

const router = express.Router();

// Admin login
router.post(
    "/login",
    loginValidator,
    validationMiddleware,
    AdminController.loginAdmin
);

// Send OTP for password reset
router.post(
    "/send-otp",
    AdminController.sendAdminOtp
);

// Verify OTP
router.post(
    "/verify-otp",
    AdminController.verifyAdminOtp
);

// Reset admin password
router.put(
    "/reset-password",
    AdminController.resetPassword
);

// Get admin profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("admin"),
    AdminController.getAdminProfile
);

// Change admin password
router.put(
    "/change-password",
    authMiddleware,
    roleMiddleware("admin"),
    AdminController.changeAdminPassword
);

// Logout admin
router.post("/logout",
    authMiddleware,
    AdminController.logout
);

module.exports = router;