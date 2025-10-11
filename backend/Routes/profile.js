const express = require('express');       
const router = express.Router();          
const pg = require('pg');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

//for the profilePic upload imagekit
const uploadProfilePic = require("../middleware/uploadProfilePic")


router.get("/username/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const userResult = await pool.query(
      `SELECT id, 
      username, 
      email ,
       profile_pic,
       is_therapist::boolean as is_therapist    
        FROM users WHERE username = $1`,
      [username]                                   //this part of code made me crazy : Hamzeh Mehyar
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const postResult = await pool.query(
      `
        SELECT 
          posts.id, 
          posts.user_id,
          posts.content, 
          posts.created_at, 
          posts.category, 
          posts.is_anonymous,
          posts.photo ,
          posts.video,
          users.username AS username,
          users.profile_pic
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = $1
        ORDER BY posts.created_at DESC
        LIMIT $2 OFFSET $3
      `,
      [user.id , limit , offset]
    );

    res.json({
      user,
      posts: postResult.rows,
    });

  } catch (error) {
    console.error("Error getting user by username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/profile-pic/:userId" , uploadProfilePic);


module.exports = router;