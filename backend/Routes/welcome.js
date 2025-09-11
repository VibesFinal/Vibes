// welcome.js — Uses Gemini AI to generate a fresh welcome message per login

require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a personalized welcome message using Gemini AI
 * @param {string} username - The name of the user logging in
 * @returns {Promise<string>} - AI-generated welcome message
 */
async function generateWelcomeMessage(username = "Valued User") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // ✅ IMPROVED PROMPT — Forces ONE clean message
    const prompt = `
      You are Gemini, a warm, friendly, and intelligent AI assistant.
      Generate ONE personalized welcome message for a user named "${username}" who just logged in.
      Keep it under 3 sentences. Use a cheerful, welcoming tone. Include 1-2 relevant emojis.
      Do NOT give multiple options. Do NOT add labels like "Option 1". Do NOT explain yourself.
      Just return the message directly, ready to display to the user.
      Current time context: ${new Date().toLocaleString()}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    // Fallback message if API fails
    return `👋 Hello ${username}! Welcome back! I'm Gemini, your AI assistant. Let me know how I can help you today! 🌟`;
  }
}

module.exports = { generateWelcomeMessage };