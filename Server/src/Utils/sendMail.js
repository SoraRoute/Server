/**
 * Shared Module
 *
 * Used by Customer and Seller modules.
 * This helper sends emails for verification and password reset.
 *
 * Authors: Nishtha & Pinki
 */

const transporter = require("../Config/mailConfig");

class SendMail {
  // Send an email to the given recipient.
  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error("Email sending failed:", error.message);
      throw new Error("Unable to send email.");
    }
  }
}

module.exports = new SendMail();