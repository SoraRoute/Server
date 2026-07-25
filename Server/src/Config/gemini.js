const { GoogleGenAI } = require("@google/genai");

// Authors: Nishtha & Pinki

// Initialize the Gemini AI client.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

module.exports = ai;