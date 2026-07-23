/**
 * Author : Pinki
 * 
 * Admin Module
 * Exposes the admin dashboard summary statistics endpoint.
 */

const AdminDashboardService = require("../Services/adminDashboardService");

class AdminDashboardController{

    // Get Dashboard Statistics.
    async getDashboardStatistics(req,res){
        try{
            const summary = await AdminDashboardService.getDashboardStatistics();

            return res.status(200).json({
                success: true,
                message: summary.message,
                data: summary.data
            });
            
        }catch(error){
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    
    }
}

module.exports = new AdminDashboardController();