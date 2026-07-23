/**
 * Author : Pinki
 * Handles all admin authentication and account-related HTTP requests.
 * Receives client requests, invokes AdminService for business logic,
 * manages authentication cookies, and returns API responses.
 */

const AdminService = require("../Services/adminService");
const cookieHelper = require("../Utils/cookieHelper");

class AdminController {
    
    // Authenticates an admin and stores the JWT in an HttpOnly cookie.
    async loginAdmin(req, res) {
        try {
            const result = await AdminService.loginAdmin(req.body);

            // Set authentication cookie
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

    // Retrieves the authenticated admin's profile.
    async getAdminProfile(req, res) {
        try {
            const adminId = req.user.adminId;
            const result = await AdminService.getAdminProfile(adminId);

            return res.status(200).json({
                success: true,
                message: "Admin profile fetched successfully.",
                data: result,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Updates the authenticated admin's password.
    async changeAdminPassword(req, res) {
        try {
            const adminId = req.user.adminId;

            const result = await AdminService.changeAdminPassword(adminId, req.body);

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

    // Sends an OTP to the admin's registered email.
    async sendAdminOtp(req, res) {
        try {
            const result = await AdminService.sendAdminOtp(req.body.email);

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

    // Verifies the OTP submitted by the admin.
    async verifyAdminOtp(req, res) {
        try {
            const result = await AdminService.verifyOtp(
                req.body.email,
                req.body.otp,
                req.body.purpose,
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

    // Resets the admin's password after successful OTP verification.
    async resetPassword(req, res) {
        try {
            const result = await AdminService.resetPassword(
                req.body.email,
                req.body.otp,
                req.body.newPassword,
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

    // Logs out the admin by clearing the authentication cookie.
    async logout(req, res) {
        // Remove authentication cookie
        cookieHelper.clearAuthCookie(res);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    }
}

module.exports = new AdminController();