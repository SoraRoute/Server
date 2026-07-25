/**
 * Author : Pinki
 *
 * Admin Seller Routes
 * Handles seller management operations such as
 * viewing sellers and updating seller status.
 */

const express = require("express");

const router = express.Router();

const adminSellerController =
    require("../controllers/adminSellerController");


const authMiddleware =
    require("../Middleware/authMiddleware");

const roleMiddleware =
    require("../Middleware/roleMiddleware");


// Get all sellers
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    adminSellerController.getAllSellers
);

// Get seller by ID
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    adminSellerController.getSellerById
);


// Update seller status
router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    adminSellerController.updateSellerStatus
);

module.exports = router;
