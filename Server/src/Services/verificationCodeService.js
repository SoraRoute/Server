/**
 * Author : Nishtha
 *
 * Verification Code Service
 * Handles OTP generation, email delivery,
 * verification, and expiration management.
 */

const passwordUtil = require("../Utils/password");
const otpGenerator = require("../Utils/otpGenerator");
const sendMail = require("../Utils/sendMail");
const verificationCodeRepository = require("../Repositories/verificationCodeRepository");

class VerificationCodeService {

    // Generate and send OTP to the user's email
    async sendVerificationCode(email, purpose) {

        // Generate a 6-digit OTP
        const otp = otpGenerator.generateOTP();

        // Hash the OTP before storing
        const otpHash = await passwordUtil.hashPassword(otp);

        // Set OTP expiration time
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Remove any existing OTP for the same email and purpose
        await verificationCodeRepository.deleteVerificationCode(
            email,
            purpose
        );

        // Save the new OTP
        await verificationCodeRepository.createVerificationCode(
            email,
            otpHash,
            purpose,
            expiresAt
        );

        // Send OTP email
        await sendMail.sendEmail(
            email,
            "MarketHive Verification Code",
            `
                <h2>Email Verification</h2>

                <p>Your OTP is:</p>

                <h1>${otp}</h1>

                <p>This OTP is valid for 10 minutes.</p>

                <p>Do not share this OTP with anyone.</p>
            `
        );
    }

    // Verify the entered OTP
    async verifyCode(email, purpose, enteredOTP) {

        // Retrieve stored OTP
        const verificationCode =
            await verificationCodeRepository.findVerificationCode(
                email,
                purpose
            );

        // Check if OTP exists
        if (!verificationCode) {
            throw new Error("OTP not found.");
        }

        // Check if OTP has expired
        if (new Date() > verificationCode.expires_at) {

            await verificationCodeRepository.deleteVerificationCode(
                email,
                purpose
            );

            throw new Error("OTP has expired.");
        }

        // Compare entered OTP with stored hash
        const isMatch =
            await passwordUtil.comparePassword(
                enteredOTP,
                verificationCode.otp_hash
            );

        // Reject invalid OTP
        if (!isMatch) {
            throw new Error("Invalid OTP.");
        }

        // Delete OTP after successful verification
        await verificationCodeRepository.deleteVerificationCode(
            email,
            purpose
        );

        return true;
    }

}

module.exports = new VerificationCodeService();