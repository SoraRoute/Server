/**
 * Author : Nishtha
 * 
 * Customer Module
 * Handles database operations related to customer payments,
 * including creating payment records, retrieving payment details,
 * and updating payment status.
 */

const db = require("../Config/dbConnection");

class CustomerPaymentRepository {

    // Save payment details for an order.
    async createPayment(orderId, paymentMethod, paymentStatus, transactionId) {
        const sql = `
        INSERT INTO payments(
            order_id, 
            payment_method, 
            payment_status, 
            transaction_id
        
        ) VALUES (?, ?, ?, ?)`;

        const [result] = await db.query(sql, [
            orderId,
            paymentMethod,
            paymentStatus,
            transactionId,
        ]);

        return result.insertId;
    }

    // Get payment information for a specific order.
    async getPaymentByOrderId(orderId) {
        const sql = `
            SELECT *
            FROM payments
            WHERE order_id=?`;

        const [rows] = await db.query(sql, [orderId]);
        return rows[0];
    }

    // Update the payment status after payment processing.
    async updatePaymentStatus(orderId, paymentStatus, transactionId) {
        const sql = `
            UPDATE payments
            SET payment_status = ?, transaction_id = ?
            WHERE order_id=?`;

        const [result] = await db.query(sql, [
            paymentStatus,
            transactionId,
            orderId,
        ]);

        return result.affectedRows;
    }
}

module.exports = new CustomerPaymentRepository();