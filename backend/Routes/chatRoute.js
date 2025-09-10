const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

require('dotenv').config();

router.post("/" , async (req , res) => {

    try {
        
        const { message } = req.body;

        if(!message){

            return res.status(400).json({error : "Message is required"});

        }

        //prompt
        const systemPrompt = "You are a friendly AI assistant. Always respond kindly and help the user.";

        const response = await fetch(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            
            {

                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({

                    contents: [

                        {

                            parts: [

                                { text: systemPrompt },
                                { text: message },

                            ],

                        },

                    ],

                    generationConfig: {

                        temperature: 0.7,
                        maxOutputTokens: 256 


                    }

                }),

            }

        );

        const data = await response.json();

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "sorry , I couldn't generate a response";

        res.json({ reply });

    } catch (error) {

        console.error("chat route error : " , error);

        res.status(500).json({error : "something went wrong"});
        
    }

});

module.exports = router