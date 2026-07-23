/**
 * Author : Nishtha & Pinki
 * 
 * Shared Module
 * This middleware is shared across the Customer, Seller, and Admin modules.
 * Any changes to this file may impact authentication throughout the application.
 */

/**
 * Authenticates incoming requests by validating the JWT stored
 * in the authentication cookie and attaching the decoded user
 * information to the request object.
 */

const jwtProvider = require("../utils/jwtProvider");

const authMiddleware = (req, res, next) => {

    try {
        // Retrieve JWT from the authentication cookie
        const token = req.cookies.access_token;

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Authorization token is required.",
            });
        }

        // Verify the JWT
        const decoded = jwtProvider.verifyToken(token);

        // Attach authenticated user information to the request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
    
};

module.exports = authMiddleware;