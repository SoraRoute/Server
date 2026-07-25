/**
 * Author : Nishtha
 *
 * Customer Product Service
 * Handles business logic for
 * retrieving products, searching
 * products, fetching product details,
 * and filtering products by category.
 */

const customerProductRepository = require("../Repositories/customerProductRepository");

class CustomerProductService {

    // Group product images into a single product object.
    groupProducts(products) {
        
        const groupedProducts = new Map();

        for (const product of products) {
            if (!groupedProducts.has(product.id)) {
                groupedProducts.set(product.id, {
                    ...product,
                    images: [],
                });

                delete groupedProducts.get(product.id).image_url;
            }

            if (product.image_url) {
                groupedProducts.get(product.id).images.push({
                    image_url: product.image_url,
                });
            }
        }

        return Array.from(groupedProducts.values());
    }

    // Get all available products.
    async getAllProducts() {
        const products = await customerProductRepository.getAllProducts();
       
        return {
            success: true,
            products: this.groupProducts(products),
        };
    }

    // Get details of a specific product.
    async getProductById(productId) {
        const products = await customerProductRepository.getProductById(productId);

        if (products.length === 0) {
            throw new Error("Product not found");
        }

        return {
            success: true,
            product: this.groupProducts(products)[0],
        };
    }

    // Search products using a keyword.
    async searchProducts(keyword) {
        const products = await customerProductRepository.searchProducts(keyword);

        return {
            success: true,
            products: this.groupProducts(products),
        };
    }

    // Get all products belonging to a category.
    async getProductsByCategory(categoryId) {
        const category =
            await customerProductRepository.findCategoryById(categoryId);

        if (!category) {
            throw new Error("Category not found");
        }

        const products =
            await customerProductRepository.getProductsByCategory(categoryId);

        return {
            success: true,
            products: this.groupProducts(products),
        };
    }
}

module.exports = new CustomerProductService();