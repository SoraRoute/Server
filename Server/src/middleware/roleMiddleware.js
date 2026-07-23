/**
 * Author : Nishtha & Pinki
 * 
 * Shared Module
 * This middleware is shared across the Customer, Seller, and Admin modules.
 * Any changes to this file may impact role-based access control throughout the application.
 */

/**
 * Authorizes requests by allowing access only to users
 * whose roles match the permitted roles.
 */

const roleMiddleware = (...allowedRoles) => {

    return (req, res, next) => {

        try {
            // Ensure the user is authenticated
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access.",
                });
            }

            // Check whether the user's role is permitted
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied.",
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };
};

module.exports = roleMiddleware;