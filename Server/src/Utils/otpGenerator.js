/**
 * Shared Module
 *
 * Used by Customer and Seller authentication.
 * This helper generates OTPs for verification and password reset.
 *
 * Authors: Nishtha & Pinki
 */

class OTPGenerator {
  // Generate a random 6-digit OTP.
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

module.exports = new OTPGenerator();