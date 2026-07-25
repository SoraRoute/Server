/**
 * Author: Nishtha
 * 
 * Customer Module
 * Handles customer shopping cart operations including
 * adding, retrieving, updating, and removing cart items.
 */


const customerCartService = require("../Services/customerCartService");

class CustomerCartController {
    // Add a product to the customer's cart.
    async addToCart(req, res) {
        try {
            const result = await customerCartService.addToCart(
                req.user.customerId,
                req.params.productId,
                req.body.quantity,
            );

            return res.status(201).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get all products in the customer's cart.
    async getCart(req, res) {
        try {
            const result = await customerCartService.getCart(req.user.customerId);

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Update the quantity of a cart item.
    async updateCartItem(req, res) {
        try {
            const result = await customerCartService.updateCartItem(
                req.user.customerId,
                req.params.productId,
                req.body.quantity,
            );

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Remove a product from the customer's cart.
    async removeFromCart(req, res) {
        try {
            const result = await customerCartService.removeFromCart(
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

module.exports = new CustomerCartController();