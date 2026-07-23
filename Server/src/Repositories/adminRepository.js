/**
 * Author : Pinki
 * 
 * Admin Module
 * Database queries for admin authentication.
 */

class AdminRepository {

    // Find Admin By Email.
    async findAdminByEmail(connection, email) {
        const query = `
            SELECT *
            FROM users
            WHERE email = ?
            AND role = ?
        `;

        const [rows] = await connection.query(query, [email, "admin"]);
        return rows;
    }

    // Find Admin By ID
    async findAdminById(connection, adminId) {
        const query = `
            SELECT
                id,
                first_name,
                last_name,
                email,
                mobile,
                role,
                created_at
            FROM users
            WHERE id = ?
            AND role = ?
        `;

        const [rows] = await connection.query(query, [adminId, "admin"]);
        return rows;
    }

    // Find Amind Password By Given ID.
    async findAdminPasswordById(connection, adminId) {
        const query = `
            SELECT password
            FROM users
            WHERE id = ?
            AND role = ?
        `;

        const [rows] = await connection.query(query, [adminId, "admin"]);
        return rows;
    }

    // Update Admin Password By Id.
    async updateAdminPasswordById(connection, adminId, newPassword) {
        const query = `
            UPDATE users
            SET password = ?
            WHERE id = ?
            AND role = ?
        `;

        const [result] = await connection.query(query, [
            newPassword,
            adminId,
            "admin"
        ]);

        return result.affectedRows;
    }

    // Update Admin Password By Email.
    async updateAdminPasswordByEmail(connection, email, newPassword) {
        const query = `
            UPDATE users
            SET password = ?
            WHERE email = ?
            AND role = ?
        `;

        const [result] = await connection.query(query, [
            newPassword,
            email,
            "admin"
        ]);

        return result.affectedRows;
    }

    // Save Otp.
    async saveOtp(connection, email, otpHash, purpose, expiresAt) {
        await connection.query(
            `
            INSERT INTO verification_codes (
                email,
                otp_hash,
                purpose,
                expires_at
            )
            VALUES (?, ?, ?, ?)
            `,
            [email, otpHash, purpose, expiresAt]
        );
    }

    // Find Otp By Email.
    async findOtpByEmail(connection, email, purpose) {
        const [rows] = await connection.query(
            `
            SELECT *
            FROM verification_codes
            WHERE email = ?
            AND purpose = ?
            `,
            [email, purpose]
        );

        return rows[0];
    }

    // Delete Otp.
    async deleteOtp(connection, email, purpose) {
        await connection.query(
            `
            DELETE FROM verification_codes
            WHERE email = ?
            AND purpose = ?
            `,
            [email, purpose]
        );
    }
}

module.exports = new AdminRepository();