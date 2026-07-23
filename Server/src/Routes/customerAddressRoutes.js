/**
 * Author : Nishtha
 *
 * Customer Address Routes
 * Handles customer address management including
 * creating, viewing, updating, and deleting addresses.
 */

const express = require("express");
const router = express.Router();

const customerAddressController = require("../controllers/customerAddressContoller");
const authenticateCustomer = require("../middleware/authMiddleware");

// Create a new address.
router.post("/", authenticateCustomer, customerAddressController.createAddress);

// Get all customer addresses.
router.get("/", authenticateCustomer, customerAddressController.getAddresses);

// Get a specific address by ID.
router.get("/:id", authenticateCustomer, customerAddressController.getAddress);

// Update an existing address.
router.patch(
    "/:id",
    authenticateCustomer,
    customerAddressController.updateAddress,
);

// Delete an address.
router.delete(
    "/:id",
    authenticateCustomer,
    customerAddressController.deleteAddress,
);

module.exports = router;