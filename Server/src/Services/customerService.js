/**
 * Author : Nishtha
 *
 * Customer Service
 * Handles business logic for customer
 * authentication, registration, email
 * verification, password management,
 * profile retrieval, and profile updates.
 */

const customerRepository = require("../Repositories/customerRepository");
const passwordUtil = require("../Utils/password");
const verificationCodeService = require("./verificationCodeService");
const jwtProvider = require("../Utils/jwtProvider");

class CustomerService {

    // Register a new customer by sending an email verification code.
    async registerCustomer(customerData) {
        // Check if the email is already registered.
        const existingCustomer = await customerRepository.findCustomerByEmail(
            customerData.email,
        );

        if (existingCustomer) {
            throw new Error("Email already registered");
        }

        await verificationCodeService.sendVerificationCode(
            customerData.email,
            "REGISTER",
        );

        return {
            success: true,
            message: "OTP sent successfully. Please verify your email",
        };
    }

    // Verify the OTP and create the customer account.
    async verifyEmail(customerData, otp) {
        await verificationCodeService.verifyCode(
            customerData.email,
            "REGISTER",
            otp,
        );

        // Hash the password before saving it.
        customerData.password = await passwordUtil.hashPassword(
            customerData.password,
        );

        const customerId = await customerRepository.createCustomer(customerData);

        return {
            success: true,
            message: "Customer registered successfully",
            customerId,
        };
    }

    // Authenticate the customer and generate a JWT.
    async loginCustomer(loginData) {
        const customer = await customerRepository.findCustomerByEmail(
            loginData.email,
        );

        if (!customer) {
            throw new Error("Invalid Email or Password");
        }

        const isPasswordCorrect = await passwordUtil.comparePassword(
            loginData.password,
            customer.password,
        );

        if (!isPasswordCorrect) {
            throw new Error("Invalid Email or Password");
        }

        // Generate JWT for authenticated customer.
        const token = jwtProvider.generateToken({
            customerId: customer.id,
            role: customer.role,
        });

        // Return customer details without the password.
        const customerResponse = {
            id: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            mobile: customer.mobile,
            role: customer.role,
        };

        return {
            success: true,
            message: "Login successful",
            token,
            customer: customerResponse,
        };
    }

    // Send an OTP for password reset.
    async forgotPassword(email) {
        const customer = await customerRepository.findCustomerByEmail(email);

        if (!customer) {
            throw new Error("Customer not found");
        }

        await verificationCodeService.sendVerificationCode(
            email,
            "RESET_PASSWORD",
        );

        return {
            success: true,
            message: "OTP sent successfully",
        };
    }

    // Verify the OTP and update the password.
    async resetPassword(email, otp, newPassword) {
        await verificationCodeService.verifyCode(
            email,
            "RESET_PASSWORD",
            otp,
        );

        const hashedPassword = await passwordUtil.hashPassword(newPassword);

        const rowsUpdated = await customerRepository.updatePassword(
            email,
            hashedPassword,
        );

        if (rowsUpdated === 0) {
            throw new Error("Customer not found");
        }

        return {
            success: true,
            message: "Password reset successfully",
        };
    }

    // Get the customer's profile information.
    async getCustomerProfile(customerId) {
        const customer = await customerRepository.findCustomerById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        // Remove the password before returning the data.
        delete customer.password;

        return {
            success: true,
            customer,
        };
    }

    // Update the customer's profile.
    async updateCustomerProfile(customerId, customerData) {
        const customer = await customerRepository.findCustomerById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const rowsUpdated = await customerRepository.updateCustomerProfile(
            customerId,
            customerData,
        );

        if (rowsUpdated === 0) {
            throw new Error("Profile update failed");
        }

        return {
            success: true,
            message: "Profile updated successfully",
        };
    }
}

module.exports = new CustomerService();