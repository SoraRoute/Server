/**
 
Authors: Nishtha & Pinki*
Shared Module*
Used by Customer and Seller modules.
Configures the email transporter for sending emails.**/

require("dotenv").config();
const nodemailer = require("nodemailer");

// Create a reusable transporter for sending emails.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify SMTP connection when the server starts.
transporter.verify((error) => {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is ready to send emails.");
    }
});

module.exports = transporter;
