const express = require('express');       
const router = express.Router();          
const pg = require('pg');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });


router.get("/username/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const userResult = await pool.query(
      "SELECT id, username, email FROM users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    const postResult = await pool.query(
      `
        SELECT 
          posts.id, 
          posts.content, 
          posts.created_at, 
          posts.category, 
          posts.is_anonymous,
          posts.photo ,
           posts.video,
          users.username AS username
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = $1
        ORDER BY posts.created_at DESC
      `,
      [user.id]
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


module.exports = router;