/**
 * Seller Module
 *
 * Author : Pinki
 * Business logic for seller registration, authentication,
 * profile management, and bank/business details.
 */

const bcrypt = require("bcrypt");

const db = require("../Config/dbConnection");
const sellerRepository = require("../Repositories/sellerRepository");
const jwtProvider = require("../Utils/jwtProvider");
const otpGenerator = require("../Utils/otpGenerator");
const sendMail = require("../Utils/sendMail");
const constants = require("../Constants/OTPPurpose");

class SellerService {

    // Send Seller OTP.
    async sendSellerOtp(email, purpose) {

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const existingSeller =
                await sellerRepository.findSellerByEmail(
                    connection,
                    email
                );

            if (purpose === constants.REGISTER && existingSeller) {
                throw new Error("Seller Already Registered.");
            }

            if (purpose === constants.RESET_PASSWORD && !existingSeller) {
                throw new Error("Seller does not exist.");
            }

            const otp = otpGenerator.generateOTP();

            const otpHash = await bcrypt.hash(otp, 10);

            const expiresAt = new Date(
                Date.now() + 10 * 60 * 1000
            );

            await sellerRepository.deleteOtp(
                connection,
                email,
                purpose
            );

            await sellerRepository.saveOtp(
                connection,
                email,
                otpHash,
                purpose,
                expiresAt
            );

            const subject =
                purpose === constants.REGISTER
                    ? "Seller Registration OTP"
                    : "Reset Password OTP";

            await sendMail.sendEmail(
                email,
                subject,
                `
                    <h2>Your OTP is ${otp}</h2>
                    <p>This OTP is valid for 10 minutes.</p>
                `
            );

            await connection.commit();

            return {
                message: "OTP sent successfully."
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }
    }

    // Register Seller.
    async registerSeller(sellerData) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const existingSeller =
                await sellerRepository.findSellerByEmail(
                    connection,
                    sellerData.email
                );

            if (existingSeller) {
                throw new Error("Email already registered.");
            }

            // Find registration OTP.
            const otpRecord =
                await sellerRepository.findOtpByEmail(
                    connection,
                    sellerData.email,
                    constants.REGISTER
                );

            if (!otpRecord) {
                throw new Error("Please verify email first.");
            }

            // Check OTP expiry.
            if (new Date() > new Date(otpRecord.expires_at)) {
                throw new Error("OTP has expired.");
            }

            /*
             * OTP verification is handled separately through
             * verifySellerOtp() before registration.
             */

            // Delete OTP after successful verification.
            await sellerRepository.deleteOtp(
                connection,
                sellerData.email,
                constants.REGISTER
            );

            // Hash Password.
            sellerData.passwordd = await bcrypt.hash(
                sellerData.passwordd,
                10
            );

            // Create Seller.
            const sellerId =
                await sellerRepository.createSeller(
                    connection,
                    sellerData
                );

            // Create Address.
            await sellerRepository.createAddress(
                connection,
                sellerId,
                sellerData.address
            );

            // Create Business Details.
            await sellerRepository.createBusinessDetails(
                connection,
                sellerId,
                sellerData.business
            );

            // Create Bank Details.
            await sellerRepository.createBankDetails(
                connection,
                sellerId,
                sellerData.bank
            );

            await connection.commit();

            return {
                message: "Seller registered successfully",
                sellerId
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }
    }

    // Verify Seller OTP.
    async verifySellerOtp(email, otp, purpose) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const otpRecord =
                await sellerRepository.findOtpByEmail(
                    connection,
                    email,
                    purpose
                );

            if (!otpRecord) {
                throw new Error("OTP not found or has expired.");
            }

            if (new Date() > new Date(otpRecord.expires_at)) {
                throw new Error("OTP has expired.");
            }

            const isMatch = await bcrypt.compare(
                otp,
                otpRecord.otp_hash
            );

            if (!isMatch) {
                throw new Error("Invalid OTP.");
            }

            await connection.commit();

            let message = "OTP Verified Successfully.";

            if (purpose === constants.REGISTER) {
                message = "Email Verified Successfully.";
            }

            return {
                message
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }
    }

    // Login Seller.
    async loginSeller(loginData) {

        const connection = await db.getConnection();

        try {

            const existingSeller =
                await sellerRepository.findSellerByEmail(
                    connection,
                    loginData.email
                );

            if (!existingSeller) {
                throw new Error("Invalid Email or Password");
            }

            const seller = existingSeller;

            const isMatch = await bcrypt.compare(
                loginData.passwordd,
                seller.passwordd
            );

            if (!isMatch) {
                throw new Error("Invalid Email or Password");
            }

            const token = jwtProvider.generateToken({
                sellerId: seller.id,
                role: seller.role
            });

            return {
                message: "Login Successful",
                token
            };

        } catch (error) {

            throw error;

        } finally {

            connection.release();
        }
    }

    // Reset Password.
    async resetPassword(email, otp, newPassword) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const seller =
                await sellerRepository.findSellerByEmail(
                    connection,
                    email
                );

            if (!seller) {
                throw new Error("Seller does not exist.");
            }

            // Find reset-password OTP using the same connection.
            const otpRecord =
                await sellerRepository.findOtpByEmail(
                    connection,
                    email,
                    constants.RESET_PASSWORD
                );

            if (!otpRecord) {
                throw new Error("OTP not found or has expired.");
            }

            if (new Date() > new Date(otpRecord.expires_at)) {
                throw new Error("OTP has expired.");
            }

            const isMatch = await bcrypt.compare(
                otp,
                otpRecord.otp_hash
            );

            if (!isMatch) {
                throw new Error("Invalid OTP.");
            }

            const hashedPassword =
                await bcrypt.hash(newPassword, 10);

            await sellerRepository.updateSellerPassword(
                connection,
                email,
                hashedPassword
            );

            // Delete OTP after successful password reset.
            await sellerRepository.deleteOtp(
                connection,
                email,
                constants.RESET_PASSWORD
            );

            await connection.commit();

            return {
                message: "Password Changed Successfully."
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }
    }

    // Get Seller Profile.
    async getSellerProfile(id) {

        const connection = await db.getConnection();

        try {

            const existingSeller =
                await sellerRepository.getSellerById(
                    connection,
                    id
                );

            if (!existingSeller) {
                throw new Error("Seller Does Not Exist.");
            }

            return existingSeller;

        } finally {

            connection.release();
        }
    }

    // Update Seller Profile.
    async updateSellerProfile(sellerId, sellerData) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const existingSeller =
                await sellerRepository.getSellerById(
                    connection,
                    sellerId
                );

            if (!existingSeller) {
                throw new Error("Seller does not exist.");
            }

            const existingSellerWithSameData =
                await sellerRepository.checkSellerExists(
                    connection,
                    sellerData.mobile,
                    sellerData.gstin,
                    sellerId
                );

            if (existingSellerWithSameData) {
                throw new Error(
                    "Mobile number or GSTIN already exists."
                );
            }

            const result =
                await sellerRepository.updateSellerProfile(
                    connection,
                    sellerId,
                    sellerData
                );

            if (result.affectedRows === 0) {
                throw new Error("Failed to update profile.");
            }

            await connection.commit();

            return {
                success: true,
                message: "Profile updated successfully."
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }
    }

    // Change Password.
    async changePassword(sellerId, passwordData) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const seller =
                await sellerRepository.getSellerPassword(
                    connection,
                    sellerId
                );

            if (!seller) {
                throw new Error("Seller does not exist.");
            }

            const isPasswordValid =
                await bcrypt.compare(
                    passwordData.oldPassword,
                    seller.passwordd
                );

            if (!isPasswordValid) {
                throw new Error(
                    "Current password is incorrect."
                );
            }

            const isSamePassword =
                await bcrypt.compare(
                    passwordData.newPassword,
                    seller.passwordd
                );

            if (isSamePassword) {
                throw new Error(
                    "New password cannot be the same as the current password."
                );
            }

            const hashedPassword =
                await bcrypt.hash(
                    passwordData.newPassword,
                    10
                );

            const result =
                await sellerRepository.updatePassword(
                    connection,
                    sellerId,
                    hashedPassword
                );

            if (result.affectedRows === 0) {
                throw new Error(
                    "Failed to change password."
                );
            }

            await connection.commit();

            return {
                success: true,
                message: "Password changed successfully."
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }
    }

    // Get Seller Orders.
    async getSellerOrders(sellerId) {

        const connection = await db.getConnection();

        try {

            const orders =
                await sellerRepository.getSellerOrders(
                    connection,
                    sellerId
                );

            return {
                success: true,
                data: orders,
                message: "Seller orders fetched successfully."
            };

        } catch (error) {

            throw error;

        } finally {

            connection.release();
        }
    }

    // Get Seller Revenue.
    async getSellerRevenue(sellerId) {

        const connection = await db.getConnection();

        try {

            const revenue =
                await sellerRepository.getSellerRevenue(
                    connection,
                    sellerId
                );

            return {
                success: true,
                data: revenue,
                message: "Seller revenue fetched successfully."
            };

        } catch (error) {

            throw error;

        } finally {

            connection.release();
        }
    }

    // Update Order Status.
    async updateOrderStatus(
        orderId,
        sellerId,
        orderStatus
    ) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const allowedStatus = [
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ];

            if (!allowedStatus.includes(orderStatus)) {
                throw new Error("Invalid order status.");
            }

            const existingOrder =
                await sellerRepository.getOrderById(
                    connection,
                    orderId,
                    sellerId
                );

            if (!existingOrder) {
                throw new Error("Order not found.");
            }

            const result =
                await sellerRepository.updateOrderStatus(
                    connection,
                    orderId,
                    orderStatus
                );

            if (result.affectedRows === 0) {
                throw new Error(
                    "Failed to update order status."
                );
            }

            await connection.commit();

            return {
                success: true,
                message: "Order status updated successfully."
            };

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();
        }
    }
}

module.exports = new SellerService();
