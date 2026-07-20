const db = require("../config/dbConnection");

class CustomerAddressRepository {
  // Author: Nishtha
  // Save a new address for the customer.
  async createAddress(customerAddressData) {
    const sql = `
      INSERT INTO customer_addresses
      (customer_id, address_line1, address_line2, city, state, pincode, country, address_type)
      VALUES (?,?,?,?,?,?,?,?)`;

    const [result] = await db.query(sql, [
      customerAddressData.customer_id,
      customerAddressData.address_line1,
      customerAddressData.address_line2,
      customerAddressData.city,
      customerAddressData.state,
      customerAddressData.pincode,
      customerAddressData.country,
      customerAddressData.address_type,
    ]);

    return result.insertId;
  }

  // Get all saved addresses of a customer.
  async getAddressesByCustomerId(customerId) {
    const sql = `
      SELECT * FROM customer_addresses
      WHERE customer_id=?`;

    const [rows] = await db.query(sql, [customerId]);
    return rows;
  }

  // Fetch a single address using its ID.
  async getAddressById(addressId) {
    const sql = `
      SELECT *
      FROM customer_addresses
      WHERE id=?
      LIMIT 1`;

    const [rows] = await db.query(sql, [addressId]);
    return rows[0];
  }

  // Update an existing customer address.
  async updateAddress(addressId, customerAddressData) {
    const sql = `
      UPDATE customer_addresses
      SET
        address_line1=?,
        address_line2=?,
        city=?,
        state=?,
        pincode=?,
        country=?,
        address_type=?
      WHERE id=?`;

    const [result] = await db.query(sql, [
      customerAddressData.address_line1,
      customerAddressData.address_line2,
      customerAddressData.city,
      customerAddressData.state,
      customerAddressData.pincode,
      customerAddressData.country,
      customerAddressData.address_type,
      addressId,
    ]);

    return result.affectedRows;
  }

  // Remove an address from the customer's account.
  async deleteAddress(addressId) {
    const sql = `
      DELETE FROM customer_addresses
      WHERE id=?`;

    const [result] = await db.query(sql, [addressId]);
    return result.affectedRows;
  }

  // Placeholder for setting a default address.
  async setDefaultAddress() {}
}

module.exports = new CustomerAddressRepository();