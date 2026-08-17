/**
 * Seller Module
 *
 * Author : Pinki
 * Business logic for a seller's own products: create,
 * list, view, update, delete, and status changes.
 */

const db = require("../Config/dbConnection");
const productRepository = require("../Repositories/productRepository");
const cloudinaryHelper = require("../Utils/cloudinaryHelper");


class ProductService {

    // Add Product.
    async addProduct(sellerId, productData, files) {
        const connection = await db.getConnection();

        let uploadedImages = [];

        try {
            await connection.beginTransaction();

            if (!files || files.length === 0) {
                throw new Error("At least one product image is required.");
            }

            productData.seller_id = sellerId;

            uploadedImages = await cloudinaryHelper.uploadMultipleImages(files);

            const productId = await productRepository.createProduct(connection, productData);

            await productRepository.addProductImages(connection, productId, uploadedImages);

            await connection.commit();

            return {
                success: true,
                message: "Product Added Successfully.",
                productId
            };

        } catch (error) {
            await connection.rollback();

            if (uploadedImages.length > 0) {
                await cloudinaryHelper.deleteMultipleImages(uploadedImages.map(image => image.public_id));
            }
            throw error;

        } finally {
            connection.release();
        }
    }

    // Get Seller Products.
    async getSellerProducts(sellerId) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            const products = await productRepository.getSellerProducts(connection, sellerId);

            await connection.commit();
            return products;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }

    // Get Product By Id.
    async getProductById(productId, sellerId) {
        const connection = await db.getConnection();

        try {
            const products = await productRepository.getProductById(connection, productId, sellerId);

            if (!products) {
                throw new Error("Product Not Found");
            }

            const images = await productRepository.getProductImages(connection, productId);

            products.images = images;
            await connection.commit();

            return products;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }

    // Update Product.
    async updateProduct(productId, sellerId, productData) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const rows = await productRepository.getProductById(connection, productId, sellerId);

            if (!rows) {
                throw new Error("Product Not Found");
            }

            await productRepository.updateProduct(connection, productId, sellerId, productData);

            await connection.commit()

        } catch (error) {
            await connection.rollback()
            throw error

        } finally {
            connection.release();
        }
    }

    // Delete Product.
    async deleteProduct(productId, sellerId) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const product = await productRepository.getProductById(connection,
                productId,
                sellerId
            );

            if (!product) {
                throw new Error("Product Not Found");
            }

            const images = await productRepository.getProductImages(connection, productId);

            if (images.length > 0) {
                await cloudinaryHelper.deleteMultipleImages(
                    images.map(image => image.public_id)
                );
            }

            await productRepository.deleteProductImages(connection, productId);

            await productRepository.deleteProduct(connection, productId, sellerId);

            await connection.commit();

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }

    // Update Product Images: add new images and/or remove existing ones.
    async updateProductImages(productId, sellerId, files, imageIdsToDelete = []) {
        const connection = await db.getConnection();

        let uploadedImages = [];

        try {
            await connection.beginTransaction();

            const product = await productRepository.getProductById(connection, productId, sellerId);

            if (!product) {
                throw new Error("Product Not Found");
            }

            // Remove requested images first (and clean them up on Cloudinary).
            if (imageIdsToDelete.length > 0) {
                const imagesToRemove = await productRepository.getProductImagesByIds(
                    connection,
                    productId,
                    imageIdsToDelete
                );

                if (imagesToRemove.length > 0) {
                    await productRepository.deleteProductImagesByIds(
                        connection,
                        productId,
                        imagesToRemove.map(image => image.id)
                    );

                    await cloudinaryHelper.deleteMultipleImages(
                        imagesToRemove.map(image => image.public_id)
                    );
                }
            }

            // Add new images, if any were uploaded.
            if (files && files.length > 0) {
                const existingCount = await productRepository.countProductImages(connection, productId);

                if (existingCount + files.length > 5) {
                    throw new Error("A product can have a maximum of 5 images.");
                }

                uploadedImages = await cloudinaryHelper.uploadMultipleImages(files);

                await productRepository.addProductImages(connection, productId, uploadedImages);
            }

            const remainingCount = await productRepository.countProductImages(connection, productId);

            if (remainingCount === 0) {
                throw new Error("A product must have at least one image.");
            }

            await connection.commit();

            const images = await productRepository.getProductImages(connection, productId);

            return {
                success: true,
                message: "Product images updated successfully.",
                images
            };

        } catch (error) {
            await connection.rollback();

            if (uploadedImages.length > 0) {
                await cloudinaryHelper.deleteMultipleImages(uploadedImages.map(image => image.public_id));
            }
            throw error;

        } finally {
            connection.release();
        }
    }

    // Update Status.
    async updateStatus(productId, sellerId, status) {
        const connection = await db.getConnection();

        try {
            connection.beginTransaction();

            const allowedStatus = [
                "ACTIVE",
                "INACTIVE"
            ];

            if (!allowedStatus.includes(status)) {
                throw new Error("Invalid product status.");
            }

            const product = productRepository.getProductById(connection,productId, sellerId);

            if (!product) {
                throw new Error("Product Not Found");
            }

            productRepository.updateStatus(productId, sellerId, status);

            await connection.commit();

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }
}

module.exports = new ProductService();
