/**
 * Author : Nishtha
 *
 * AI Routes
 * Handles AI chat requests.
 */

const express = require("express");
const router = express.Router();

const aiController = require("../Controllers/aiController");

// Process AI chat request
router.post("/chat", aiController.chat);

module.exports = router;