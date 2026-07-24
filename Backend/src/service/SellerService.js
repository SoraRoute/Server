const db = require("../db/db");
const jwtProvider = require("../util/jwtProvider");
class SellerService {

    async createSeller(sellerData) {

        const existingSeller = await this.getSellerByEmail(sellerData.email);

        if (existingSeller) {
            throw new Error("Seller already exists with this email");
        }

        let savedAddress = sellerData.pickupAddress;

        const addressId = await new Promise((resolve, reject) => {

            const sql = `
                INSERT INTO addresses
                (name, locality, pincode, state, address, mobile)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    savedAddress.name,
                    savedAddress.locality,
                    savedAddress.pincode,
                    savedAddress.state,
                    savedAddress.address,
                    savedAddress.mobile
                ],
                (err, result) => {

                    if (err) return reject(err);

                    resolve(result.insertId);

                }
            );

        });

        savedAddress = addressId;

        const sellerId = await new Promise((resolve, reject) => {

            const sql = `
                INSERT INTO sellers
                (
                    seller_name,
                    mobile_number,
                    email,
                    password,
                    business_name,
                    business_email,
                    business_mobile,
                    business_address,
                    account_number,
                    account_holder_name,
                    bank_name,
                    ifsc_code,
                    pickup_address_id,
                    gstin,
                    role,
                    account_status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    sellerData.sellerName,
                    sellerData.mobile,
                    sellerData.email,
                    sellerData.password,

                    sellerData.businessDetails.businessName,
                    sellerData.businessDetails.businessEmail,
                    sellerData.businessDetails.businessMobile,
                    sellerData.businessDetails.businessAddress,

                    sellerData.bankDetails.accountNumber,
                    sellerData.bankDetails.accountHolderName,
                    sellerData.bankDetails.bankName,
                    sellerData.bankDetails.ifscCode,

                    savedAddress,

                    sellerData.gstNumber,

                    "ROLE_SELLER",
                    "PENDING_VERIFICATION"
                ],
                (err, result) => {

                    if (err) return reject(err);

                    resolve(result.insertId);

                }
            );

        });

        return this.getSellerById(sellerId);

    }

    async getSellerById(id) {

        return new Promise((resolve, reject) => {

            const sql = `SELECT * FROM sellers WHERE id = ?`;

            db.query(sql, [id], (err, results) => {

                if (err) return reject(err);

                if (results.length === 0) {
                    return reject(new Error("Seller not found"));
                }

                resolve(results[0]);

            });

        });

    }

async getAllSellers(status) {
    return new Promise((resolve, reject) => {

        let sql = "SELECT * FROM sellers";
        let params = [];

        if (status) {
            sql += " WHERE account_status = ?";
            params.push(status);
        }

        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });

    });
}

    async updateSeller(existingSeller, sellerData) {

        return new Promise((resolve, reject) => {

            const sql = `
                UPDATE sellers
                SET
                    seller_name = ?,
                    mobile_number = ?,
                    business_name = ?,
                    business_email = ?,
                    business_mobile = ?,
                    business_address = ?,
                    account_number = ?,
                    account_holder_name = ?,
                    bank_name = ?,
                    ifsc_code = ?,
                    gstin = ?
                WHERE id = ?
            `;

            db.query(
                sql,
                [
                    sellerData.sellerName,
                    sellerData.mobile,

                    sellerData.businessDetails.businessName,
                    sellerData.businessDetails.businessEmail,
                    sellerData.businessDetails.businessMobile,
                    sellerData.businessDetails.businessAddress,

                    sellerData.bankDetails.accountNumber,
                    sellerData.bankDetails.accountHolderName,
                    sellerData.bankDetails.bankName,
                    sellerData.bankDetails.ifscCode,

                    sellerData.gstNumber,

                    existingSeller.id
                ],
                async (err) => {

                    if (err) return reject(err);

                    const seller = await this.getSellerById(existingSeller.id);

                    resolve(seller);

                }
            );

        });

    }

    async updateSellerStatus(sellerId, status) {

        return new Promise((resolve, reject) => {

            const sql = `
                UPDATE sellers
                SET account_status = ?
                WHERE id = ?
            `;

            db.query(sql, [status, sellerId], async (err) => {

                if (err) return reject(err);

                const seller = await this.getSellerById(sellerId);

                resolve(seller);

            });

        });

    }

    async deleteSeller(sellerId) {

        return new Promise((resolve, reject) => {

            const sql = `DELETE FROM sellers WHERE id = ?`;

            db.query(sql, [sellerId], (err, result) => {

                if (err) return reject(err);

                resolve(result);

            });

        });

    }

    async getSellerProfile(jwt) {

        const email = jwtProvider.getEmailFromJwt(jwt);

        return this.getSellerByEmail(email);

    }

    async getSellerByEmail(email) {

    return new Promise((resolve, reject) => {

        const sql = `SELECT * FROM sellers WHERE email = ?`;

        db.query(sql, [email], (err, results) => {

            if (err) return reject(err);

            if (results.length === 0) {
                return resolve(null);
            }

            resolve(results[0]);

        });

    });

}

}

module.exports = new SellerService();