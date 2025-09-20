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
                Return results in JSON with percentage per category only.

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

