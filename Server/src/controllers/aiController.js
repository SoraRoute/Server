/**
 * Author : Nishtha
 * 
 * Handles AI chat API requests by receiving user messages,
 * forwarding them to the AI service, and returning the generated response.
 */

const aiService = require("../Services/aiService");

class AiController {
    /**
     * Processes an AI chat request and returns the generated response.
     */
    async chat(req, res) {
        try {
            const { message } = req.body;

            const result = await aiService.chat(message);

            res.status(200).json(result);

        } catch (error) {

            // Return an error response if AI processing fails.
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new AiController();