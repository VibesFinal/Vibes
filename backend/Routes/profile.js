const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');


const pool = new pg.Pool( { connectionString: process.env.DATABASE_URL } );

router.get("/:username" , async (req , res) => {

    const { username } = req.params;

    //const userIdNum = parseInt(userId);
    

    /*if(isNaN(userIdNum)){

        return res.status(400).json({error: "invalid user id"})

    } */

    try { 

        const userResult = await pool.query(

            "SELECT id, username , email FROM users WHERE username = $1",

            [username]

        );

        if(userResult.rows.length === 0){

            return res.status(404).json({error : "user not found"});

        }

        const user = userResult.rows[0];
        
        const postResult = await pool.query(

            `SELECT posts.id, posts.content, posts.created_at, posts.category, users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE users.username = $1
            ORDER BY posts.created_at DESC`,

            [username]

        );

        res.json({

            user,
            posts: postResult.rows,

        });

    } catch (error) {

        console.error("error getting user posts", error);

        res.status(500).json({error: "Internal server error"});
        
        
    }


});

module.exports = router;