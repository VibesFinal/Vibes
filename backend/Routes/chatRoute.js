const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

require('dotenv').config();

router.post("/", async (req, res) => {

  try {

    const { message, history = [] } = req.body;
    
    if (!message) {

      return res.status(400).json({ error: "Message is required" });

    }

    const systemPrompt = `You're a warm CBT therapist who uses emojis and humor 😊 

                Keep responses SHORT but complete: 2-3 sentences (occasionally 4 if really needed).
                Validate feelings → spot thought distortions → offer one tool or reframe. 
                Be warm, playful, conversational. Use emojis naturally. ❤️

Example: "That sounds really tough, getting criticism from a friend can sting 💔 I'm wondering if you're maybe catastrophizing a bit - like one negative comment = whole project is bad? Try this: write down 3 things you like about your project to balance out that one critique! ✨"`;

    const contents = [

      { parts: [{ text: systemPrompt }], role: "user" },
      { parts: [{ text: "Got it! I'll be supportive, use CBT, and keep it fun! 😊" }], role: "model" }

    ];

    history.forEach(msg => {

      contents.push({

        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]

      });

    });

    contents.push({

      role: "user",
      parts: [{ text: message }]

    });

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
            topP: 0.95,
            topK: 40

          },

          safetySettings: [

            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }

          ]
        }),
      }
    );

    const data = await response.json();
    
    // Log full response for debugging
    console.log("Full Gemini Response:", JSON.stringify(data, null, 2));

    // Check for blocked content
    if (data.promptFeedback?.blockReason) {
      console.error("Content blocked:", data.promptFeedback.blockReason);
      return res.json({ 
        reply: "Hmm, let me rephrase that... What's been weighing on you? 💭" 
      });
    }

    // Check if response exists
    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates in response:", data);
      return res.json({ 
        reply: "I'm here to listen! Can you tell me more about what's going on? 😊" 
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                  "I'm having a little hiccup - can you say that again? 😅";
    
    res.json({ reply });
    
  } catch (error) {
    console.error("Chat route error:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ 
      error: "Something went wrong",
      details: error.message 
    });
  }
});

module.exports = router