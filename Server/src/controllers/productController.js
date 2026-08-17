/**
 * Author : Pinki
 * 
 * Seller Module
 * Handles HTTP requests for a seller's own products:
 * create, list, view, update, delete, and status changes.
 */

const { deleteProduct } = require("../Repositories/productRepository");
const productServices = require("../Services/productServices");
const ProductService = require("../Services/productServices");

class ProductController{

    // Add Product.
    async addProduct(req,res,next){
        try{
            const sellerId = req.user.sellerId;
            const response = await ProductService.addProduct(
                sellerId,
                req.body,
                req.files
            );

            return res.status(201).json(response);
            
        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get Seller Products.
    async getSellerProducts(req,res){
        try{
            const sellerId = req.user.sellerId;
            const products = await productServices.getSellerProducts(sellerId);

            return res.status(200).json({
                success: true,
                message: "Prodcuts fetched successfully.",
                data: products
            });

        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get Product By Id.
    async getProductById(req,res){
        try{
            const sellerId = req.user.sellerId;
            const productId = req.params.id;

            const product = await productServices.getProductById(productId,sellerId);

            return res.status(200).json({
                success: true,
                message: "Product Fetched Successfully.",
                data: product
            });

        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

    }

    // Update Product.
    async updateProduct(req,res){
        try{
            const sellerId = req.user.sellerId;
            const productId = req.params.id;

            await productServices.updateProduct(
                productId,
                sellerId,
                req.body
            );

            return res.status(200).json({
                success: true,
                message: "Product Updated Successfully."
            });

        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete Product.
    async deleteProduct(req,res){
        try{
            const sellerId = req.user.sellerId;
            const prodcutId = req.params.id;

            await productServices.deleteProduct(prodcutId,sellerId);

            return res.status(200).json({
                success: true,
                message: "Product Deleted Successfully."
            });

        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update Product Images.
    async updateProductImages(req, res) {
        try {
            const sellerId = req.user.sellerId;
            const productId = req.params.id;

            // imageIdsToDelete may arrive as a JSON array string or repeated
            // form fields, so normalize it into an array of numbers.
            let imageIdsToDelete = req.body.imageIdsToDelete || [];
            if (typeof imageIdsToDelete === "string") {
                try {
                    imageIdsToDelete = JSON.parse(imageIdsToDelete);
                } catch {
                    imageIdsToDelete = [imageIdsToDelete];
                }
            }
            imageIdsToDelete = [].concat(imageIdsToDelete).map(Number).filter(Boolean);

            const response = await ProductService.updateProductImages(
                productId,
                sellerId,
                req.files,
                imageIdsToDelete
            );

            return res.status(200).json(response);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update Status.
    async updateStatus(req,res){
        try{
            const sellerId = req.user.sellerId;
            const prodcutId = req.params.id;
            const {status} = req.body;

            await productServices.updateStatus(prodcutId,sellerId,status);

            return res.status(200).json({
                success: true,
                message: "Product Status Updated Successfully."
            });
            
        }catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ProductController();