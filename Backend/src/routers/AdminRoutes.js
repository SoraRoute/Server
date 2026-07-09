const express = require("express");
const router = express.Router();

const SellerController = require("../controller/SellerController");

router.patch(
  "/seller/:id/status/:status",
  SellerController.updateSellerAccountStatus
);

module.exports = router;