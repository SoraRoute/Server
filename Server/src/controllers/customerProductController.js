const customerProductService = require("../Services/customerProductService");

class CustomerProductController {
  // Author: Nishtha
  // Get all available products.
  async getAllProducts(req, res) {
    try {
      const getProducts = await customerProductService.getAllProducts();

      return res.status(200).json(getProducts);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get details of a specific product.
  async getProductById(req, res) {
    try {
      const product = await customerProductService.getProductById(
        req.params.productId,
      );

      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Search products using a keyword.
  async searchProducts(req, res) {
    try {
      const products = await customerProductService.searchProducts(
        req.query.keyword,
      );

      return res.status(200).json(products);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all products from a specific category.
  async getProductsByCategory(req, res) {
    try {
      const product = await customerProductService.getProductsByCategory(
        req.params.categoryId,
      );

      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CustomerProductController();