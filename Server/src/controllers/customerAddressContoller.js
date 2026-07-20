const customerAddressService = require("../Services/customerAddressService");

class CustomerAddressController {
  // Author: Nishtha
  // Create a new customer address.
  async createAddress(req, res) {
    try {
      const result = await customerAddressService.createAddress(
        req.user.customerId,
        req.body,
      );

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all addresses of the logged-in customer.
  async getAddresses(req, res) {
    try {
      const result = await customerAddressService.getAddresses(
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

  // Get a specific customer address.
  async getAddress(req, res) {
    try {
      const result = await customerAddressService.getAddress(
        req.params.id,
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

  // Update an existing customer address.
  async updateAddress(req, res) {
    try {
      const result = await customerAddressService.updateAddress(
        req.params.id,
        req.user.customerId,
        req.body,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete a customer address.
  async deleteAddress(req, res) {
    try {
      const result = await customerAddressService.deleteAddress(
        req.params.id,
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
}

module.exports = new CustomerAddressController();