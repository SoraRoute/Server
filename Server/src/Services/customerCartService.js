/**
 * Author : Nishtha
 *
 * Customer Cart Service
 * Handles business logic for managing the customer's
 * shopping cart, including adding, updating,
 * retrieving, and removing cart items.
 */

const customerCartRepository = require("../Repositories/customercartRepository");
const customerRepository = require("../Repositories/customerRepository");
const productRepository = require("../Repositories/productRepository");

class CustomerCartService {
    
    // Add a product to the customer's cart.
    async addToCart(customerId, productId, quantity) {
        const customer = await customerRepository.findCustomerById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const product = await productRepository.findProductById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        // Create a cart if the customer doesn't have one.
        let cart = await customerCartRepository.getCartByUserId(customerId);

        if (!cart) {
            const cartId = await customerCartRepository.createCart(customerId);
            cart = {
                id: cartId,
            };
        }

        // If the product already exists, increase its quantity.
        const cartItem = await customerCartRepository.findCartItem(
            cart.id,
            productId,
        );

        if (cartItem) {
            const rowsUpdated = await customerCartRepository.updateCartItemQuantity(
                cart.id,
                productId,
                cartItem.quantity + quantity,
            );

            if (rowsUpdated === 0) {
                throw new Error("Failed to update cart");
            }

            return {
                success: true,
                message: "Cart updated successfully",
            };
        }

        // Otherwise, add it as a new cart item.
        const cartItemId = await customerCartRepository.addProductToCart(
            cart.id,
            productId,
            quantity,
        );

        return {
            success: true,
            message: "Product added to cart",
            cartItemId,
        };
    }

    // Get all products currently in the customer's cart.
    async getCart(customerId) {
        const customer = await customerRepository.findCustomerById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const cart = await customerCartRepository.getCartByUserId(customerId);

        if (!cart) {
            return {
                success: true,
                cart: [],
            };
        }

        const cartProducts = await customerCartRepository.getCartProducts(cart.id);

        return {
            success: true,
            cart: cartProducts,
        };
    }

    // Update the quantity of a product in the cart.
    async updateCartItem(customerId, productId, quantity) {
        const customer = await customerRepository.findCustomerById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const cart = await customerCartRepository.getCartByUserId(customerId);

        if (!cart) {
            throw new Error("Cart not found");
        }

        const cartItem = await customerCartRepository.findCartItem(
            cart.id,
            productId,
        );

        if (!cartItem) {
            throw new Error("Product not found in cart");
        }

        const rowsUpdated = await customerCartRepository.updateCartItemQuantity(
            cart.id,
            productId,
            quantity,
        );

        if (rowsUpdated === 0) {
            throw new Error("Failed to update cart");
        }

        return {
            success: true,
            message: "Cart updated successfully",
        };
    }

    // Remove a product from the customer's cart.
    async removeFromCart(customerId, productId) {
        const customer = await customerRepository.findCustomerById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const cart = await customerCartRepository.getCartByUserId(customerId);

        if (!cart) {
            throw new Error("Cart not found");
        }

        const cartItem = await customerCartRepository.findCartItem(
            cart.id,
            productId,
        );

        if (!cartItem) {
            throw new Error("Product not found in cart");
        }

        const rowsDeleted = await customerCartRepository.removeProductFromCart(
            cart.id,
            productId,
        );

        if (rowsDeleted === 0) {
            throw new Error("Failed to remove product from cart");
        }

        return {
            success: true,
            message: "Product removed from cart",
        };
    }
}

module.exports = new CustomerCartService();
