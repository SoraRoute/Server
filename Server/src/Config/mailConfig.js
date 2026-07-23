/**
 *  Authors: Nishtha & Pinki
 * 
 * Shared Module
 *
 * Used by Customer and Seller modules.
 * Configures the email transporter for sending emails.
 *
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

// Create a reusable transporter for sending emails.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transporter;