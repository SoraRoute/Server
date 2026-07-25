/**
 * Author : Nishtha
 * 
 * Customer Module
 * Handles database operations related to customer accounts,
 * including account creation, profile management,
 * authentication, and password updates.
 */

const db = require("../Config/dbConnection");

class CustomerRepository {

    // Create a new customer account.
    async createCustomer(customerData) {
        const sql = `
        INSERT INTO users(
            first_name, 
            last_name, 
            email, 
            mobile, 
            password, 
            role
        
        ) VALUES (?,?,?,?,?,?)`;

        const [result] = await db.query(sql, [
            customerData.first_name,
            customerData.last_name,
            customerData.email,
            customerData.mobile,
            customerData.password,
            (customerData.role = "customer"),
        ]);

        return result.insertId;
    }

    // Find a customer using their email address.
    async findCustomerByEmail(email) {
        const sql = `
        SELECT *
        FROM users
        WHERE email=?
        LIMIT 1`;

        const [rows] = await db.query(sql, [email]);
        return rows[0];
    }

    // Fetch customer details by ID.
    async findCustomerById(id) {
        const sql = `
        SELECT *
        FROM users
        WHERE id=?
        LIMIT 1`;

        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }

    // Update the customer's password.
    async updatePassword(email, hashedPassword) {
        const sql = `
        UPDATE users
        SET password=?
        WHERE email=?`;

        const [result] = await db.query(sql, [hashedPassword, email]);
        return result.affectedRows;
    }

    // Update basic profile information.
    async updateCustomerProfile(customerId, customerData) {
        const sql = `
        UPDATE users
        SET
            first_name=?,
            last_name=?,
            mobile=?
        WHERE id=?`;

        const [result] = await db.query(sql, [
            customerData.first_name,
            customerData.last_name,
            customerData.mobile,
            customerId,
        ]);

        return result.affectedRows;
    }
}

module.exports = new CustomerRepository();
