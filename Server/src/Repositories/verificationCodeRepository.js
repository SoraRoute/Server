/** 
 * Shared Module
 *
 * Author : Nishtha
 * 
 * Handles database operations for verification codes (OTPs)
 * used across the Customer, Seller, and Admin modules.
 */

const db = require("../config/dbConnection");

class VerificationCodeRepository {

    // Stores a new verification code for the given email and purpose.
    async createVerificationCode(email, otpHash, purpose, expiresAt) {
        const sql = `
        INSERT INTO verification_codes
        (email, otp_hash, purpose, expires_at)
        VALUES (?, ?, ?, ?)
        `;

        await db.query(sql, [
            email,
            otpHash,
            purpose,
            expiresAt,
        ]);
    }


    // Retrieves the most recent verification code for the given
    // email and verification purpose.
    async findVerificationCode(email, purpose) {
        const sql = `
        SELECT *
        FROM verification_codes
        WHERE email = ?
            AND purpose = ?
        ORDER BY created_at DESC
        LIMIT 1
        `;

        const [rows] = await db.query(sql, [
            email,
            purpose,
        ]);

        return rows[0];
    }


    // Removes all verification codes associated with the given
    // email and verification purpose.
    async deleteVerificationCode(email, purpose) {
        const sql = `
        DELETE FROM verification_codes
        WHERE email = ?
        AND purpose = ?
        `;

        await db.query(sql, [
            email,
            purpose,
        ]);
    }
}

module.exports = new VerificationCodeRepository();