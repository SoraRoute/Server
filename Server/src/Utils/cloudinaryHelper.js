/**
 * Shared Module
 * Authors : Pinki & Nishtha
 * 
 * Used by the Seller module for product images.
 * Wraps Cloudinary upload/delete calls and removes the
 * temporary local file once the upload succeeds.
 *
 * Authors: Nishtha & Pinki
 */

const cloudinary = require("../Config/cloudinary");
const fs = require("fs");

class CloudinaryHelper {

    // Upload Image.
    async uploadImage(filePath) {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "products"
        });

        fs.unlinkSync(filePath);

        return {
            image_url: result.secure_url,
            public_id: result.public_id
        };
    }

    // Upload Multiple Images.
    async uploadMultipleImages(files) {
        const uploadedImages = [];

        for (const file of files) {
            const image = await this.uploadImage(file.path);
            uploadedImages.push(image);
        }

        return uploadedImages;
    }

    // Delete Image.
    async deleteImage(publicId) {
        await cloudinary.uploader.destroy(publicId);
    }

    // Delete Multiple Images.
    async deleteMultipleImages(publicIds) {
        for (const publicId of publicIds) {
            await this.deleteImage(publicId);
        }
    }
}

module.exports = new CloudinaryHelper();