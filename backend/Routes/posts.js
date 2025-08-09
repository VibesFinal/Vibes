const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');


const pool = new pg.Pool( { connectionString: process.env.DATABASE_URL } );

//create a new post
router.post("/" , routeGuard , async (req , res) => {


    const { content } = req.body;

    const user_id = req.user.id; // from token

    if(!user_id || !content){

        return res.status(400).send("user_id and content are required");

    }

    try {
        
        const insertResult = await pool.query(

            "INSERT INTO posts (user_id , content) VALUES ($1 , $2) RETURNING *",

            [user_id , content]


        );

        const postId = insertResult.rows[0].id;

        //fetching the full post

        const fullPost = await pool.query(

            `SELECT posts.id, users.username, posts.content, posts.created_at
            
            FROM posts
            
            JOIN users ON posts.user_id = users.id
            
            WHERE posts.id = $1`,

            [postId]

        );

        res.status(201).json(fullPost.rows[0]);

    } catch (error) {

        console.error("error creating a post" , error);

        res.status(500).send("server error");
        
        
    }

});

router.get("/" , async (req , res) => {

    try {
        
        const result = await pool.query(

            ` SELECT posts.id, users.username, posts.content, posts.created_at
             FROM posts
             JOIN users ON posts.user_id = users.id
             ORDER BY posts.created_at DESC `

        );

        res.json(result.rows);

    } catch (error) {

        console.error("error fetching posts");

        res.status(500).send("server error");
        
    }


});


module.exports = router;