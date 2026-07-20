const customerHomeRepository = require("../Repositories/customerHomeRepository");

class CustomerHomeService {
  // Author: Nishtha
  // Fetch all data required for the customer home page.
  async getHomePage() {
    const categories = await customerHomeRepository.getCategories();
    const featureProducts = await customerHomeRepository.getFeaturedProducts();
    const newArrivals = await customerHomeRepository.getNewArrivals();

    return {
      success: true,
      categories,
      featureProducts,
      newArrivals,
    };
  }
}

module.exports = new CustomerHomeService();