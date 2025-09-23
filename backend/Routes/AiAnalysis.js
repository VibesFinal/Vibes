const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');


const pool = new pg.Pool( { connectionString: process.env.DATABASE_URL } );


const { GoogleGenerativeAI } = require("@google/generative-ai");


//initialize a gemini
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//analyzing the user posts
router.get("/analyze/:userId" , routeGuard , async(req , res) => {

    const { userId } = req.params;

    try {
        
        const postResult = await pool.query(

            `SELECT content FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,

            [userId]

        );

        const posts = postResult.rows.map(r => r.content);

        if(posts.length === 0){

            return res.status(200).json({ message: "no posts found" , chartData: [] });

        }

        
        //here we are sending the posts to gemini for emotional analysis
        const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        
                Analyze these user posts for mental health indicators.
                Classify each as one of: [positive, neutral, anxious, depressive, stressed].
                Return ONLY a valid JSON object with percentage per category.
                DO NOT include categories with 0%.
                DO NOT include any explanations, notes, markdown, or extra text — ONLY JSON.
                 

                Posts: ${JSON.stringify(posts)}
        
        `;

        const result = await model.generateContent(prompt);


        //extracting the ai response

        const textResponse = result.response.text();
        

        let cleanResponse = textResponse.trim();

        
        cleanResponse = cleanResponse.replace(/```json|```/g, "").trim();

        let analysis;

        try {
            
            analysis = JSON.parse(cleanResponse);

        } catch (error) {

            console.error("failed to parse gemini response", cleanResponse);
            return res.status(500).json({error : "invalid ai response format"});            
            
        }



        //now we want to send the results back to the frontend
        res.json({

            postAnalyzed: posts.length,
            chartData: analysis

        });

    } catch (error) {

        console.error("error analyzing posts: " , error);
        res.status(500).json({error: "failed to analyze posts"});
        
    }

});

module.exports = router;

/*const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze user posts for emotional tone
router.get("/analyze/:userId", routeGuard, async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch user's latest 20 posts
        const postResult = await pool.query(
            `SELECT content FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
            [userId]
        );

        const posts = postResult.rows.map(r => r.content);

        if (posts.length === 0) {
            return res.status(200).json({
                message: "No posts found",
                chartData: {
                    positive: 0,
                    neutral: 100,
                    anxious: 0,
                    depressive: 0,
                    stressed: 0
                },
                postAnalyzed: 0
            });
        }

        // Initialize Gemini model
        const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 🧠 STRONGLY CONSTRAINED PROMPT — forces clean JSON output
        const prompt = `
You are an AI that analyzes emotional tone in social media posts.
Classify the overall sentiment across all provided posts into these 5 categories:
- positive
- neutral
- anxious
- depressive
- stressed

Return ONLY a valid JSON object with these exact 5 keys. Each value must be a NUMBER between 0 and 100.
The total should roughly add up to 100 (allow ±5 for rounding).
DO NOT include any explanations, notes, markdown, or extra text.

Example output:
{
  "positive": 30,
  "neutral": 50,
  "anxious": 5,
  "depressive": 5,
  "stressed": 10
}

Posts to analyze:
${JSON.stringify(posts)}
        `.trim();

        // Call Gemini
        const result = await model.generateContent(prompt);
        let textResponse = result.response.text().trim();

        // 🔍 DEBUG: Uncomment to see raw response during development
        // console.log("Raw Gemini Response:", textResponse);

        // 🧹 Clean common wrappers (Markdown code blocks)
        textResponse = textResponse.replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, '$1').trim();

        let analysis;

        try {
            // 🔎 Extract first JSON object from text
            const jsonMatch = textResponse.match(/\{[\s\S]*?\}/);
            if (!jsonMatch) {
                throw new Error("No JSON object detected in AI response");
            }

            analysis = JSON.parse(jsonMatch[0]);

            // ✅ Validate structure and types
            const requiredKeys = ['positive', 'neutral', 'anxious', 'depressive', 'stressed'];
            for (const key of requiredKeys) {
                if (!(key in analysis)) {
                    throw new Error(`Missing required key: ${key}`);
                }
                if (typeof analysis[key] !== 'number' || isNaN(analysis[key])) {
                    throw new Error(`Invalid value for ${key}: must be a number`);
                }
                // Optional: clamp between 0-100
                analysis[key] = Math.max(0, Math.min(100, Math.round(analysis[key])));
            }

            // Optional: Normalize to sum 100 (if needed)
            const total = Object.values(analysis).reduce((sum, val) => sum + val, 0);
            if (total > 0 && Math.abs(total - 100) > 5) {
                console.warn(`Gemini response total: ${total}, normalizing...`);
                const scale = 100 / total;
                for (const key of requiredKeys) {
                    analysis[key] = Math.round(analysis[key] * scale);
                }
            }

        } catch (parseError) {
            console.error("❌ Failed to parse or validate AI response:", textResponse);
            console.error("Parse error details:", parseError.message);

            // Fallback: return neutral if AI fails
            return res.status(500).json({
                error: "AI returned malformed response",
                fallback: true,
                chartData: {
                    positive: 0,
                    neutral: 100,
                    anxious: 0,
                    depressive: 0,
                    stressed: 0
                },
                postAnalyzed: posts.length
            });
        }

        // ✅ Success response
        res.json({
            postAnalyzed: posts.length,
            chartData: analysis
        });

    } catch (error) {
        console.error("❌ Server error during analysis:", error);

        // Generic fallback for any server-side crash
        res.status(500).json({
            error: "Failed to analyze posts",
            message: error.message || "Unknown error"
        });
    }
});

module.exports = router;*/

