/**
 * Author : Pinki
 * 
 * Admin Module
 *
 * Validation rules for the admin login request body,
 * used with express-validator.
 */

const { body } = require("express-validator");

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please Enter a valid Email."),

    body("password")
        .notEmpty()
        .withMessage("Password is Required.")
];

module.exports = loginValidation;