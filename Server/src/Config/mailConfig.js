/**
 
Authors: Nishtha & Pinki*
Shared Module*
Used by Customer and Seller modules.
Configures the email transporter for sending emails.
**/

require("dotenv").config();

const nodemailer = require("nodemailer");


// Check environment variables
console.log("EMAIL CONFIG CHECK:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER ? "Present" : "Missing",
    password: process.env.EMAIL_PASSWORD ? "Present" : "Missing"
});


// Create transporter
const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,

    port: Number(process.env.EMAIL_PORT),

    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000

});


// Verify SMTP connection
transporter.verify((error) => {

    if (error) {

        console.error("SMTP Connection Error:", error);

    } else {

        console.log(
            "SMTP Server is ready to send emails."
        );

    }

});


module.exports = transporter;
