/**
 * Author : Pinki
 * 
 * Seller Module
 * Handles seller account operations including registration, OTP verification,
 * authentication, profile management, password management, order management,
 * revenue tracking, and logout.
 */

const sellerService = require("../Services/sellerService");
const constants = require("../Constants/OTPPurpose");
const cookieHelper = require("../Utils/cookieHelper");

class SellerController {

    // Sends an OTP to the seller's email for account registration.
    async sendSellerOtp(req, res) {
        try {
            const { email } = req.body;

            const result = await sellerService.sendSellerOtp(
                email,
                constants.REGISTER,
            );

            return res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Verifies the registration OTP submitted by the seller.
    async verifySellerOtp(req, res) {
        try {
            const { email, otp } = req.body;

            const result = await sellerService.verifySellerOtp(
                email,
                otp,
                constants.REGISTER,
            );

            return res.status(200).json({
                success: true,
                message: result.message,
                verificationToken: result.verificationToken,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Registers a new seller after successful OTP verification.
    async registerSeller(req, res) {
        try {
            const sellerData = req.body;
            // const authHeader = req.headers.authorization;

            // if (!authHeader || !authHeader.startsWith("Bearer ")) {
            //     throw new Error("Verification token is required.");
            // }

            // const verificationToken = authHeader.split(" ")[1];

            const result = await sellerService.registerSeller(
                sellerData
            );

            return res.status(201).json({
                success: true,
                message: result.message,
                sellerId: result.sellerId,
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Authenticates the seller and stores the JWT in an HttpOnly cookie.
    async loginSeller(req, res) {
        try {
            const result = await sellerService.loginSeller(req.body);

            cookieHelper.setAuthCookie(res, result.token);

            return res.status(200).json({
                message: result.message,
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Sends an OTP to the seller's email for password reset.
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const result = await sellerService.sendSellerOtp(
                email,
                constants.RESET_PASSWORD,
            );

            return res.status(200).json({
                sucess: true,
                message: result.message,
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Resets the seller's password after successful OTP verification.
    async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;

            const result = await sellerService.resetPassword(email, otp, newPassword);

            return res.status(200).json({
                success: true,
                message: result.message,
            });

        } catch (error) {
            return res.status(400).json({
                sucess: false,
                message: error.message,
            });
        }
    }

    // Retrieves the authenticated seller's profile.
    async getSellerProfile(req, res) {
        try {
            const sellerId = req.user.sellerId;
            const result = await sellerService.getSellerProfile(sellerId);

            return res.status(200).json({
                success: true,
                message: "Seller Profile Fetched Successfully.",
                sellerData: result,
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Updates the authenticated seller's profile information.
    async updateSellerProfile(req, res) {
        try {
            const sellerId = req.user.sellerId;
            const sellerData = req.body;

            const result = await sellerService.updateSellerProfile(
                sellerId,
                sellerData,
            );

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Changes the authenticated seller's account password.
    async changePassword(req, res) {
        try {
            const sellerId = req.user.sellerId;
            const passwordData = req.body;

            const result = await sellerService.changePassword(
                sellerId,
                passwordData,
            );

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Logs out the seller by clearing the authentication cookie.
    async logout(req, res) {
        cookieHelper.clearAuthCookie(res);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    }

    // Retrieves all orders associated with the authenticated seller.
    async getSellerOrders(req, res) {
        try {
            const sellerId = req.user.sellerId;

            const result = await sellerService.getSellerOrders(sellerId);

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    //Retrieves the revenue summary for the authenticated seller.
    async getSellerRevenue(req, res) {
        try {
            const sellerId = req.user.sellerId;

            const result = await sellerService.getSellerRevenue(sellerId);

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Updates the status of a seller's order.
    async updateOrderStatus(req, res) {
        try {
            const sellerId = req.user.sellerId;
            const { orderId } = req.params;
            const { order_status } = req.body;

            const result = await sellerService.updateOrderStatus(
                orderId,
                sellerId,
                order_status,
            );

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new SellerController();