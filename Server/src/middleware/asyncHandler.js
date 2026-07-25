/**
 * Author : Nishtha
 * 
 * Shared Module
 * This utility is used by both the Customer and Seller modules.
 * Any changes to this file may impact multiple parts of the application.
 */

/**
 * Wraps asynchronous route handlers and forwards any errors
 * to the Express error-handling middleware.
 *
 * @param {Function} controller - Asynchronous route handler.
 * @returns {Function} Express middleware function.
 */

const asyncHandler = (controller) => {

    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

module.exports = asyncHandler;