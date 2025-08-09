const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');


const pool = new pg.Pool( { connectionString: process.env.DATABASE_URL } );


//like a post
router.post("/like/:postId" , routeGuard , async (req , res) => {

    const userId = req.user.id;

    const { postId } = req.params;

    try {
        
        await pool.query(

            "INSERT INTO likes (user_id , post_id) VALUES ($1 , $2) ON CONFLICT DO NOTHING",

            [userId , postId]

        );

        res.status(200).json({message : "Post liked"});

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
router.get("/like/:postId" , routeGuard , async (req , res) => {

    const userId = req.user.id;
    const { postId } = req.params;

    try {
        
        //
        const countResult = await pool.query(
            
                "SELECT COUNT(*) FROM likes WHERE post_id = $1" , 
                [postId]

            );

        
        //
        const userResult = await pool.query(

            "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",

            [userId , postId]

        );

            const liked = userResult.rows.length > 0;
            const count = parseInt(countResult.rows[0].count)

            res.status(200).json({

                count: count,
                likedByUser: liked

            });

    } catch (error) {

        console.error(error);

        res.status(500).send("server error")
        
        
    }

}); 

module.exports = router;