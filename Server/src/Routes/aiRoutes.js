const express = require("express");
const router = express.Router();

const aiController = require("../Controllers/aiController");

// Author: Nishtha

// AI chat endpoint.
router.post("/chat", aiController.chat);

module.exports = router;