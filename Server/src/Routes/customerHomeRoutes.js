const express = require("express");
const router = express.Router();


const customerHomeController = require("../controllers/customerHomeController");

// Author: Nishtha

// Get data for the home page.
router.get("/", customerHomeController.getHomePage);

module.exports = router;