/**
 * Author : Pinki
 *
 * Category Service
 * Handles business logic for category
 * management, including creating,
 * retrieving, updating, deleting,
 * and changing category status.
 */

const db = require("../Config/dbConnection");
const CategoryRepository = require("../Repositories/categoryRepository");
const productRepository = require("../Repositories/productRepository");

class CategoryService {

    // Add a new category with parent category validation.
    async addCategory(categoryData) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const existingCategory = await CategoryRepository.findCategoryByName(
                connection,
                categoryData.name
            );

            if (existingCategory) {
                throw new Error("Category Already Exists.");
            }

            if (categoryData.parent_category_id != null) {
                const parentCategory = await CategoryRepository.getCategoryById(
                    connection,
                    categoryData.parent_category_id
                );

                if (!parentCategory) {
                    throw new Error("Parent Category Not Found");
                }

                if (parentCategory.status === "INACTIVE") {
                    throw new Error(
                        "Cannot create a Subcategory Under an Inactive Category."
                    );
                }
            }

            const categoryId = await CategoryRepository.addCategory(
                connection,
                categoryData
            );

            await connection.commit();

            return {
                id: categoryId
            };

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }


    // Fetch all active categories available for customers.
    async getAllCategoriesForCustomer() {
        const connection = await db.getConnection();

        try {
            const result =
                await CategoryRepository.getAllCategoriesForCustomer(connection);

            return result;

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }


    // Fetch all categories with details for admin management.
    async getAllCategoriesForAdmin() {
        const connection = await db.getConnection();

        try {
            const result =
                await CategoryRepository.getAllCategoriesForAdmin(connection);

            return result;

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }


    // Retrieve category details by category ID.
    async getCategoryById(categoryId) {
        const connection = await db.getConnection();

        try {
            const existingCategory =
                await CategoryRepository.getCategoryById(
                    connection,
                    categoryId
                );

            if (!existingCategory) {
                throw new Error("Category Not Found.");
            }

            return existingCategory;

        } catch (error) {
            throw error;

        } finally {
            connection.release();
        }
    }


    // Update category details with validation checks.
    async updateCategory(categoryData) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const existingCategory =
                await CategoryRepository.getCategoryById(
                    connection,
                    categoryData.id
                );

            if (!existingCategory) {
                throw new Error("Category Not Found");
            }

            if (categoryData.parent_category_id !== null) {
                const parentCategory =
                    await CategoryRepository.getCategoryById(
                        connection,
                        categoryData.parent_category_id
                    );

                if (!parentCategory) {
                    throw new Error("Parent Category Not Found");
                }

                if (
                    Number(categoryData.id) ===
                    Number(categoryData.parent_category_id)
                ) {
                    throw new Error(
                        "Cannot be Same as Parent Category."
                    );
                }
            }

            const existingCategoryName =
                await CategoryRepository.findCategoryByNameExceptId(
                    connection,
                    categoryData.name,
                    categoryData.id
                );

            if (existingCategoryName) {
                throw new Error("Category Already Exists.");
            }

            const result =
                await CategoryRepository.updateCategory(
                    connection,
                    categoryData
                );

            await connection.commit();

            return result;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }


    // Delete a category after checking product dependency.
    async deleteCategory(categoryId) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const existingCategory =
                await CategoryRepository.getCategoryById(
                    connection,
                    categoryId
                );

            if (!existingCategory) {
                throw new Error("Category Not Found");
            }

            const countProduct =
                await productRepository.countProductsByCategoryId(
                    connection,
                    categoryId
                );

            if (countProduct > 0) {
                throw new Error(
                    "Cannot Delete Category because it contains Products."
                );
            }

            const result =
                await CategoryRepository.deleteCategory(
                    connection,
                    categoryId
                );

            await connection.commit();

            return result;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }


    // Change category active/inactive status.
    async changeCategoryStatus(categoryId, status) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const existingCategory =
                await CategoryRepository.getCategoryById(
                    connection,
                    categoryId
                );

            if (!existingCategory) {
                throw new Error("Category Not Found");
            }

            const result =
                await CategoryRepository.changeStatus(
                    connection,
                    categoryId,
                    status
                );

            await connection.commit();

            return result;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }
}

module.exports = new CategoryService();
