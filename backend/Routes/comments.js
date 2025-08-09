const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');


const pool = new pg.Pool( { connectionString: process.env.DATABASE_URL } );


//add a comment
router.post("/:postId" , routeGuard , async (req , res) => {


    const { postId } = req.params;

    const { content } = req.body;

    const userId = req.user.id;

    try {
        
        const result = await pool.query(

            "INSERT INTO comments ( user_id , post_id ,  content ) VALUES ($1 , $2 , $3) RETURNING *",

            [userId , postId , content]

        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error("error loading comments ", error);

        res.status(500).send( { error: "failed to add a comment" } )
        
    }

});

//get all comments for a post
router.get("/:postId" , async (req , res) => {

    const { postId } = req.params;

    try {
        
        const result = await pool.query(

            `
                SELECT comments.*, users.username
                FROM comments
                JOIN users ON comments.user_id = users.id
                WHERE post_id = $1
                ORDER BY created_at ASC

            ` , 

            [postId]

        );

        res.json(result.rows);

    } catch (error) {

        console.error("error fetching comments ", error);

        res.status(500).json({error: "failed to fetch comments"});
        
    }

});

module.exports = router;