/**
 * Author : Nishtha & Pinki
 * 
 * Shared Module
 * This middleware is shared across the Customer, Seller, and Admin modules.
 * Any changes to this file may impact request validation throughout the application.
 */


/**
 * Validates incoming request data using express-validator
 * before passing the request to the controller.
 */


const { validationResult } = require("express-validator");

const validationMiddleware = (req, res, next) => {

    // Retrieve validation errors from the request
    const errors = validationResult(req);

    // Return validation errors if any exist
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: errors.array(),
        });
    }

    // Continue to the next middleware
    next();
};

module.exports = validationMiddleware;