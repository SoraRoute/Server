/**
 * Shared Module
 *
 * Used by Customer, Seller, and Admin authentication.
 * Any changes here will affect all authentication modules.
 *
 * Authors: Nishtha & Pinki
 */

require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
const verificationSecret = process.env.JWT_VERIFICATION_SECRET;

class JwtProvider {
  // Generate an access token for authenticated users.
  generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: "24h" });
  }

  // Verify the access token and return its payload.
  verifyToken(token) {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new Error("Invalid or Expired Token");
    }
  }

  // Generate a temporary token for email verification.
  generateVerificationToken(email) {
    return jwt.sign(
      {
        email,
        purpose: "REGISTER",
      },
      verificationSecret,
      {
        expiresIn: "10m",
      },
    );
  }

  // Verify the email verification token.
  verifyVerificationToken(token) {
    try {
      const decode = jwt.verify(token, verificationSecret);

      if (decode.purpose !== "REGISTER") {
        throw new Error("Invalid Verification Token");
      }

      return decode;
    } catch (error) {
      throw new Error("Invalid or Expired Verification Token.");
    }
  }
}

module.exports = new JwtProvider();