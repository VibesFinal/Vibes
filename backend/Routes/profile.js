const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');


const pool = new pg.Pool( { connectionString: process.env.DATABASE_URL } );

router.get("/:userId" , async (req , res) => {

    const {userId} = req.params;

    const userIdNum = parseInt(userId);
    

    if(isNaN(userIdNum)){

        return res.status(400).json({error: "invalid user id"})

    }

    try {
        
        const result = await pool.query(

            `SELECT posts.id, posts.content, posts.created_at, users.username
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.user_id = $1
            ORDER BY posts.created_at DESC`,

            [userIdNum]

        );

        res.json(result.rows);

    } catch (error) {

        console.error("error getting user posts", error);

        res.status(500).json({error: "Internal server error"});
        
        
    }


});

module.exports = router;