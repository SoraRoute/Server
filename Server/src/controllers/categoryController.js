/**
 * Author : Pinki
 * 
 * Admin Module
 * Handles HTTP requests for creating, updating, listing, and
 * changing the status of product categories.
 */

const categoryService = require("../Services/categoryService");

class CategoryController {

    // Add Category.
    async addCategory(req, res) {
        try {
            const categoryData = req.body;

            const result = await categoryService.addCategory(categoryData);

            res.status(201).json({
                success: true,
                message: "Category Added Successfully",
                data: result,
            });
            
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get All Categories For Customer.
    async getAllCategoriesForCustomer(req, res) {
        try {
            const result = await categoryService.getAllCategoriesForCustomer();

            res.status(200).json({
                success: true,
                message: "Categories Fetched Successfully",
                data: result,
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get All Categories For Admin.
    async getAllCategoriesForAdmin(req, res) {
        try {
            const result = await categoryService.getAllCategoriesForAdmin();

            res.status(200).json({
                success: true,
                message: "Categories Fetched Successfully",
                data: result,
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get Category By Id.
    async getCategoryById(req, res) {
        try {
            const categoryId = req.params.id;

            const result = await categoryService.getCategoryById(categoryId);

            res.status(200).json({
                success: true,
                message: "Category Fetched Successfully",
                data: result,
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Update Category.
    async updateCategory(req, res) {
        try {
            const categoryData = {
                id: req.params.id,
                ...req.body,
            };

            const result = await categoryService.updateCategory(categoryData);

            res.status(200).json({
                success: true,
                message: "Category Updated Successfully",
                data: result,
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }


    // Delete Category.
    async deleteCategory(req, res) {
        try {
            const categoryId = req.params.id;

            const result = await categoryService.deleteCategory(categoryId);

            res.status(200).json({
                success: true,
                message: "Category Deleted Successfully",
                data: result,
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Change Category Status.
    async changeCategoryStatus(req, res) {
        try {
            const categoryId = req.params.id;
            const { status } = req.body;

            const result = await categoryService.changeCategoryStatus(
                categoryId,
                status,
            );

            res.status(200).json({
                success: true,
                message: "Category Status Updated Successfully",
                data: result,
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new CategoryController();
