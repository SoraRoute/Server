/**
 * Author : Nishtha
 *
 * Customer Home Routes
 * Handles retrieval of data required for the customer home page.
 */

const express = require("express");
const router = express.Router();

const customerHomeController = require("../controllers/customerHomeController");

// Get data for the home page.
router.get("/", customerHomeController.getHomePage);

module.exports = router;