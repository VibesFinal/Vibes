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

   if (user.profile_pic) {
      const trimmedPic = user.profile_pic.trim();
      if (trimmedPic && !trimmedPic.startsWith("http")) {
        user.profile_pic = `${process.env.BACKEND_URL || "http://localhost:7777"}/${trimmedPic}`;
      } else if (!trimmedPic) {
        // If it's just whitespace, set to null
        user.profile_pic = null;
      }
    } else {
      // Ensure it's explicitly null, not undefined
      user.profile_pic = null;
    }


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

    const posts = postResult.rows.map((post) => {
      let profilePic = null;
      
      if (post.profile_pic) {
        const trimmedPic = post.profile_pic.trim();
        if (trimmedPic) {
          profilePic = trimmedPic.startsWith("http")
            ? trimmedPic
            : `${process.env.BACKEND_URL || "http://localhost:7777"}/${trimmedPic}`;
        }
      }

      return {
        ...post,
        profile_pic: profilePic,
      };
    });

    res.json({
      user,
      posts,
    });

  } catch (error) {
    console.error("Error getting user by username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/profile-pic/:userId" , uploadProfilePic);


module.exports = router;