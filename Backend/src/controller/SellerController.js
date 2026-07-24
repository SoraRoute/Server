const SellerService = require("../service/SellerService");
const AuthService = require("../service/AuthService");
const jwtProvider = require("../util/jwtProvider");
const UserRole = require("../domain/userRole");

class SellerController {

    // Create Seller
    async createSeller(req, res) {
        try {

            const seller = await SellerService.createSeller(req.body);

            res.status(201).json({
                success: true,
                message: "Seller created successfully",
                seller
            });

        } catch (error) {

            res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    // Get Logged-in Seller Profile
    async getSellerProfile(req, res) {

        try {

            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new Error("Authorization token missing");
            }

            const token = authHeader.split(" ")[1];

            const seller = await SellerService.getSellerProfile(token);

            res.status(200).json({
                success: true,
                seller
            });

        } catch (error) {

            res.status(401).json({
                success: false,
                message: error.message
            });

        }

    }

    // Get All Sellers
    async getAllSellers(req, res) {

        try {

            const status = req.query.status;

            const sellers = await SellerService.getAllSellers(status);

            res.status(200).json({
                success: true,
                sellers
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    // Update Seller
    async updateSeller(req, res) {

        try {

            const existingSeller = req.seller;

            const seller = await SellerService.updateSeller(
                existingSeller,
                req.body
            );

            res.status(200).json({
                success: true,
                seller
            });

        } catch (error) {

            res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    // Delete Seller
    async deleteSeller(req, res) {

        try {

            await SellerService.deleteSeller(req.params.id);

            res.status(200).json({
                success: true,
                message: "Seller deleted successfully"
            });

        } catch (error) {

            res.status(404).json({
                success: false,
                message: error.message
            });

        }

    }

    // Update Seller Status
    async updateSellerAccountStatus(req, res) {

        try {

            const seller = await SellerService.updateSellerStatus(
                req.params.id,
                req.params.status
            );

            res.status(200).json({
                success: true,
                seller
            });

        } catch (error) {

            res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    // Send Login OTP
    async sendLoginOTP(req, res) {

        try {

            const { email } = req.body;

            await AuthService.sendLoginOTP(email);

            res.status(200).json({
                success: true,
                message: "OTP sent successfully"
            });

        } catch (error) {

            res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    // Verify Login OTP
    async verifyLoginOtp(req, res) {

        try {

            const { email, otp } = req.body;

            const seller = await AuthService.verifyLoginOTP(email, otp);

            const token = jwtProvider.createJwt({
                email: seller.email
            });

            res.status(200).json({

                success: true,

                message: "Login successful",

                jwt: token,

                role: UserRole.SELLER,

               

            });

        } catch (error) {

            res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = new SellerController();