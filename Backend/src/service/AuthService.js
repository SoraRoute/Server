const db = require("../db/db");
const generateOTP = require("../util/generateOtp");
const sendVerificationEmail = require("../util/sendEmail");

class AuthService {

    // Send OTP to seller email
    async sendLoginOTP(email) {
        const SIGNIN_PREFIX="signin_"
        if(email.startsWith(SIGNIN_PREFIX)){
              const seller = await new Promise((resolve, reject) => {

            const sql = "SELECT * FROM sellers WHERE email = ?";

            db.query(sql, [email], (err, results) => {

                if (err) {
                    return reject(err);
                }

                resolve(results[0] || null);

            });

        });

        if (!seller) {
            throw new Error("Seller not found");
        }
        }

    

        // Delete previous OTP if any
        await new Promise((resolve, reject) => {

            const sql = "DELETE FROM verification_codes WHERE email = ?";

            db.query(sql, [email], (err) => {

                if (err) {
                    return reject(err);
                }

                resolve();

            });

        });

        // Generate OTP
        const otp = generateOTP();

        // Save OTP in database
        await new Promise((resolve, reject) => {

            const sql = `
                INSERT INTO verification_codes (email, otp)
                VALUES (?, ?)
            `;

            db.query(sql, [email, otp], (err) => {

                if (err) {
                    return reject(err);
                }

                resolve();

            });

        });

        // Send OTP Email
        const subject = "E-Commerce Login OTP";

        const body = `
            <h2>Your Login OTP</h2>

            <h1>${otp}</h1>

            <p>This OTP is valid for login.</p>
        `;

        await sendVerificationEmail(
            email,
            subject,
            body
        );

        return {
            message: "OTP sent successfully"
        };

    }

    // Verify OTP
    async verifyLoginOTP(email, otp) {

        // Check seller
        const seller = await new Promise((resolve, reject) => {

            const sql = "SELECT * FROM sellers WHERE email = ?";

            db.query(sql, [email], (err, results) => {

                if (err) {
                    return reject(err);
                }

                resolve(results[0] || null);

            });

        });

        if (!seller) {
            throw new Error("Seller not found");
        }

        // Get OTP
        const verificationCode = await new Promise((resolve, reject) => {

            const sql = `
                SELECT *
                FROM verification_codes
                WHERE email = ?
            `;

            db.query(sql, [email], (err, results) => {

                if (err) {
                    return reject(err);
                }

                resolve(results[0] || null);

            });

        });

        if (!verificationCode) {
            throw new Error("OTP not found");
        }

        if (verificationCode.otp !== otp) {
            throw new Error("Invalid OTP");
        }

        // Delete OTP after successful verification
        await new Promise((resolve, reject) => {

            const sql = `
                DELETE FROM verification_codes
                WHERE email = ?
            `;

            db.query(sql, [email], (err) => {

                if (err) {
                    return reject(err);
                }

                resolve();

            });

        });

        return seller;

    }

}

module.exports = new AuthService();