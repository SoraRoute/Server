/**
 * Author : Nishtha & Pinki
 * 
 * Shared Module
 * Configures Multer for handling product image uploads.
 * Files are temporarily stored on disk before being pushed
 * to Cloudinary, then removed (see Utils/cloudinaryHelper.js).
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Temporary local folder where uploaded files land before being pushed to Cloudinary.
const uploadsDir = path.join("uploads", "temp");


// Ensure the temp uploads directory exists before Multer tries to write to it.
if (!fs.existsSync(uploadsDir)) {

    fs.mkdirSync(uploadsDir, { recursive: true });

}


// Disk storage engine: saves files to uploadsDir with a unique, collision-safe filename.
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },

    // Prefix the original extension with a timestamp + random number to avoid name clashes.
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }

});

// Only allow common image formats, checked by both MIME type and file extension.
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png|webp/;

    const isValid = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
        return cb(null, true);
    }

    cb(new Error("Only JPG,JPEG,PNG and WEBP images are allowed."));

};

// Multer instance used as route middleware (e.g. upload.array("images", 5)).
// Caps each uploaded file at 5MB.
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;