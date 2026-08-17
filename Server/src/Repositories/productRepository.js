/**
 * Author : Pinki
 * 
 * Seller Module
 * Handles database operations related to products,
 * including product management, product images,
 * inventory, and seller product records.
 */

const db = require("../Config/dbConnection");

class ProductRepository {

    // Create A Product.
    async createProduct(connection, productData) {

        const query = `
        Insert Into products(
            seller_id,
            category_id,
            title,
            description,
            brand,
            price,
            discount_price,
            status
        )
        Values (?,?,?,?,?,?,?,?)`;

        const values = [
            productData.seller_id,
            productData.category_id,
            productData.title,
            productData.description,
            productData.brand,
            productData.price,
            productData.discount_price,
            productData.status || "ACTIVE"
        ]

        const [result] = await connection.query(query, values);

        return result.insertId;
    }

    // Add Product Images
    async addProductImages(connection, productId, images) {

        const query = `
        Insert Into product_images(
            product_id,
            image_url,
            public_id
        )
        Values (?,?,?)`;

        for (const image of images) {
            await connection.query(query, [
                productId,
                image.image_url,
                image.public_id
            ]);
        }

    }

    // Get Seller Products
    async getSellerProducts(connection, sellerId) {

        const query = `Select
            id,
            category_id,
            title,
            description,
            brand,
            price,
            stock,
            status,
            created_at
        From products where seller_id = ?
        Order by created_at Desc
        `;

        const [rows] = await connection.query(query, [sellerId]);

        return rows;
    }

    // Get Product By its ID.
    async getProductById(connection, productId, sellerId) {

        const query = `Select * from products where id = ? and seller_id = ?
        `;

        const [rows] = await connection.query(query, [productId, sellerId]);

        return rows[0];
    }


    // Get Product Images.
    async getProductImages(connection, productId) {

        const query = `Select
            id,
            image_url,
            public_id
        from product_images
        where product_id = ? 
        `;

        const [images] = await connection.query(query, [productId]);

        return images;
    }

    // Update Product Information
    async updateProduct(connection, productId, sellerId, productData) {

        const query = `Update products Set
            category_id = ?,
            title = ?,
            description = ?,
            brand = ?,
            price = ?,
            discount_price = ?,
            stock = ?,
            status = ?
        where id = ? and
        seller_id = ?;`

        const values = [
            productData.category_id,
            productData.title,
            productData.description,
            productData.brand,
            productData.price,
            productData.discount_price,
            productData.stock,
            productData.status,
            productId,
            sellerId
        ];

        const [result] = await connection.query(query, values);

        return result;
    }

    // Delete A product by Product ID and Seller ID.
    async deleteProduct(connection, productId, sellerId) {

        const query = `Delete From products where id = ? and seller_id = ?`;

        const [result] = await connection.query(query, [productId, sellerId]);

        return result;
    }

    // Delete Product Images.
    async deleteProductImages(connection, productId) {

        const query = 'Delete from product_images where product_id = ?';

        await connection.query(query, [productId]);
    }

    // Count how many images a product currently has.
    async countProductImages(connection, productId) {

        const query = `Select Count(*) As total from product_images where product_id = ?`;

        const [result] = await connection.query(query, [productId]);

        return result[0].total;
    }

    // Get specific product images by their IDs (scoped to a product, so a
    // seller can't delete images belonging to someone else's product).
    async getProductImagesByIds(connection, productId, imageIds) {

        const query = `
        Select id, image_url, public_id
        from product_images
        where product_id = ? and id In (?)
        `;

        const [rows] = await connection.query(query, [productId, imageIds]);

        return rows;
    }

    // Delete specific product images by their IDs.
    async deleteProductImagesByIds(connection, productId, imageIds) {

        const query = `Delete from product_images where product_id = ? and id In (?)`;

        await connection.query(query, [productId, imageIds]);
    }


    // Update Product Status.
    async updateStatus(connection, productId, sellerId, status) {

        const query = `Update products Set status = ? where id = ? and seller_id = ?`;

        await connection.query(query, [status, productId, sellerId]);
    }

    // Find product method through product id only(Nishtha).
    async findProductById(productId) {

        const sql = `
            SELECT *
            FROM products
            WHERE id = ?
            LIMIT 1
        `;

        const [rows] = await db.query(sql, [productId]);

        return rows[0];
    }

    // Count Products by Category.
    async countProductsByCategoryId(connection, categoryId) {

        const query = `Select Count(*) As total from products where category_id = ?`;

        const [result] = await connection.query(query, [categoryId]);

        return result[0].total;
    }
}

module.exports = new ProductRepository();