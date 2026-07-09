const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_HOST_USER,

        pass: process.env.EMAIL_HOST_PASSWORD

    }

});

async function sendVerificationEmail(
    to,
    subject,
    body
) {
    console.log("User:", process.env.EMAIL_HOST_USER);
    console.log("Pass:", process.env.EMAIL_HOST_PASSWORD);


    await transporter.sendMail({

     from: process.env.EMAIL_HOST_USER,

        to,

        subject,

        html: body

    });

}

module.exports = sendVerificationEmail;