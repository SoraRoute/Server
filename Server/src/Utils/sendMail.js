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
            console.error("========== SMTP ERROR ==========");
            console.error(error);
            console.error("Code:", error.code);
            console.error("Command:", error.command);
            console.error("Response:", error.response);
            console.error("Stack:", error.stack);
            console.error("================================");
        
            throw new Error("Unable to send email.");
        }
    }
}

module.exports = new SendMail();
