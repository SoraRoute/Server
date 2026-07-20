const customerWishlistService = require("../Services/customerWishlistService");

class CustomerWishlistController {
  // Author: Nishtha
  // Add a product to the customer's wishlist.
  async addToWishlist(req, res) {
    try {
      const result = await customerWishlistService.addToWishlist(
        req.user.customerId,
        req.params.productId,
      );

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all products in the customer's wishlist.
  async getWishlist(req, res) {
    try {
      const result = await customerWishlistService.getWishlist(
        req.user.customerId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Remove a product from the customer's wishlist.
  async removeFromWishlist(req, res) {
    try {
      const result = await customerWishlistService.removeFromWishlist(
        req.user.customerId,
        req.params.productId,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CustomerWishlistController();