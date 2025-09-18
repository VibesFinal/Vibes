const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');


const pool = new pg.Pool( { connectionString: process.env.DATABASE_URL } );


//like a post
router.post("/like/:postId" , routeGuard , async (req , res) => {

    const userId = req.user.id;

    const { postId } = req.params;

    const { reaction_type } = req.body;

    try {
        
        await pool.query(

            `INSERT INTO likes (user_id, post_id, reaction_type)

            VALUES ($1, $2, $3)

            ON CONFLICT (user_id, post_id) DO UPDATE SET reaction_type = EXCLUDED.reaction_type`,

            [userId, postId, reaction_type || 'like']

        );

        res.status(200).json({message : "Reaction added"});

    } catch (error) {

        console.error(error);

        res.status(500).send("server error");
        
    }

});

//unlike a post 
router.delete("/like/:postId" , routeGuard , async (req , res) => {

    const userId = req.user.id;

    const { postId } = req.params;

    try {
        
        await pool.query(

            "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",

            [userId , postId]

        );

        res.status(200).json({message : "Post unliked"});

    } catch (error) {

        console.error(error);

        res.status(500).send("server error");
        
    }

});

//get likes count for the post
router.get("/like/count/:postId" , routeGuard , async (req , res) => {

    const { postId } = req.params;

    try {
        
        const result = await pool.query(

            "SELECT COUNT(*) FROM likes WHERE post_id = $1",

            [postId]

        );

        res.status(200).json({ count: parseInt(result.rows[0].count) });

    } catch (error) {

        console.error(error);

        res.status(500).send("server error");
        
    }

});

//
router.get("/like/:postId", routeGuard, async (req, res) => {

  const userId = req.user.id;
  const { postId } = req.params;

  try {

    const result = await pool.query(

      "SELECT reaction_type FROM likes WHERE user_id = $1 AND post_id = $2",

      [userId, postId]

    );

    const likedByUser = result.rows.length > 0;
    const reaction_type = likedByUser ? result.rows[0].reaction_type : null;

    const countResult = await pool.query(

      "SELECT reaction_type, COUNT(*) FROM likes WHERE post_id = $1 GROUP BY reaction_type",

      [postId]

    );

    // e.g., { like: 3, love: 1, hug: 2 }
    const counts = {};

    countResult.rows.forEach(r => {

      counts[r.reaction_type] = parseInt(r.count);

    });

    res.status(200).json({ 
        
        likedByUser, 
        reactionType: reaction_type, 
        counts 
    
    });

  } catch (error) {

    console.error(error);

    res.status(500).send("Server error");

  }

});

module.exports = router;