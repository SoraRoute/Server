/**
 * Shared Module
 *
 * Used by Customer, Seller, and Admin authentication.
 * This helper handles password hashing and password verification.
 *
 * Authors: Nishtha & Pinki
 */

const bcrypt = require("bcrypt");

class Password {
    // Convert a plain password into a hashed password.
    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    // Compare the entered password with the stored hash.
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = new Password();