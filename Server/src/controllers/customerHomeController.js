/**
 * Author: Nishtha
 * 
 * Customer Module
 * Handles customer home page requests by retrieving
 * the data required to render the application's home page.
 */

const customerHomeService = require("../Services/customerHomeService");

class CustomerHomeController {

    // Get all data required for the home page.
    async getHomePage(req, res) {
        try {
            const result = await customerHomeService.getHomePage();

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new CustomerHomeController();