/**
 * Author : Nishtha
 *
 * AI Service
 * Handles AI-powered shopping assistance by generating
 * product-based responses using the Gemini model.
 */

const ai = require("../Config/gemini");
const aiRepository = require("../Repositories/aiRepository");

class AiService {

    // Generate an AI response based on the available products.
    async chat(message) {
        // Fetch a limited set of products to include in the AI prompt.
        const products = (await aiRepository.getProductsForAI()).slice(0, 20);

        // Build the prompt with store rules and product data.
        const prompt = `
You are an AI shopping assistant for MarketHive.

Answer ONLY using the products listed below.

Never invent products, brands, prices, specifications, or categories.

If a requested product is unavailable, politely tell the customer it is not available.

If the customer's question is unrelated to shopping or the available products,
politely explain that you can only help with products available on MarketHive.

For recommendations:
- Mention product name
- Brand
- Price
- Discount price (if available)
- A short reason for recommending it.

Available products:
${JSON.stringify(products)}

Customer question:
${message}
`;

        try {
            // Send the prompt to the Gemini model.
            const response = await ai.models.generateContent({
                model: "models/gemma-4-26b-a4b-it",
                contents: prompt,
            });

            return {
                success: true,
                reply: response.text,
            };
        } catch (error) {
            // Handle temporary AI service unavailability.
            if (error.status === 503) {
                throw new Error(
                    "AI service is temporarily busy. Please try again in a few minutes.",
                );
            }

            // Handle all other unexpected errors.
            throw new Error("Unable to process your request.");
        }
    }
}

module.exports = new AiService();