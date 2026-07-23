/**
 * Author : Nishtha
 * 
 * Customer Module
 * Handles customer address management requests including
 * creating, retrieving, updating, and deleting customer addresses.
 */

const customerAddressService = require("../Services/customerAddressService");

class CustomerAddressController {

    // Creates a new address for the authenticated customer.
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

    // Retrieves all addresses associated with the authenticated customer.
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

    // Retrieves a specific customer address by its ID.
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

    // Updates an existing customer address.
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

    // Deletes a customer address.
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