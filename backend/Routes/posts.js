const express = require('express');
const router = express.Router();
const pg = require('pg');
<<<<<<< Updated upstream
const routeGuard = require('../middleware/verifyToken');

const multer = require("multer");
const path = require("path");

// Set storage for uploaded files
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");

  },

  filename: (req, file, cb) => {

    cb(null, Date.now() + path.extname(file.originalname)); // unique filename

  }

});

const upload = multer({ storage });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Create a new post
router.post("/", routeGuard, upload.fields([{ name: "photo" } , { name: "video" }]) , async (req, res) => {

    // Added 'is_anonymous' to the destructuring
    const { content, category, is_anonymous } = req.body;
    const user_id = req.user.id;

    //file paths if uploaded (ternary operators)
    const photo = req.files?.photo ? req.files.photo[0].filename : null;
    const video = req.files?.video ? req.files.video[0].filename : null;

    if (!user_id || !content) {

        return res.status(400).send("user_id and content are required");

    }

    try {
        // Updated INSERT query to include 'is_anonymous'
        const insertResult = await pool.query(

            "INSERT INTO posts (user_id, content, category, is_anonymous , photo , video) VALUES ($1, $2, $3, $4 , $5 , $6) RETURNING *",
            [user_id, content, category, is_anonymous || false , photo , video] // Pass the value, default to false

        );

        const postId = insertResult.rows[0].id;

        // Updated SELECT query to fetch 'is_anonymous' , photo and video
        const fullPost = await pool.query(

            `SELECT posts.id, users.username, posts.content, posts.created_at, posts.category, posts.is_anonymous , posts.photo , posts.video
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = $1`,
            [postId]
            
        );

        res.status(201).json(fullPost.rows[0]);
    } catch (error) {
        console.error("error creating a post", error);
        res.status(500).send("server error");
=======
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ✅ ENHANCED: Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// ✅ CRITICAL: GET /posts - Include photo and video columns
router.get('/', async (req, res) => {
  try {
    console.log('📡 GET /posts - Fetching all posts with media');
    
    const result = await pool.query(`
      SELECT 
        posts.id,
        posts.content,
        posts.created_at,
        posts.category,
        posts.is_anonymous,
        posts.photo,
        posts.video,
        users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);

    console.log(`✅ Found ${result.rows.length} posts`);
    
    // ✅ DEBUG: Log media info for each post
    result.rows.forEach((post, index) => {
      console.log(`📝 Post ${index + 1} (ID: ${post.id}):`, {
        username: post.username,
        hasPhoto: !!post.photo,
        hasVideo: !!post.video,
        photo: post.photo,
        video: post.video,
        content: post.content?.substring(0, 50) + '...'
      });
    });

    res.json(result.rows);
  } catch (error) {
    console.error('💥 Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ ENHANCED: POST /posts - Create new post with media support
router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { content, category, is_anonymous } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
>>>>>>> Stashed changes
    }

    // ✅ ENHANCED: Handle uploaded files
    const photoFile = req.files?.photo?.[0];
    const videoFile = req.files?.video?.[0];

    console.log('📤 Creating new post:', {
      userId,
      content: content.substring(0, 50) + '...',
      category,
      is_anonymous,
      hasPhoto: !!photoFile,
      hasVideo: !!videoFile,
      photoFilename: photoFile?.filename,
      videoFilename: videoFile?.filename
    });

    const result = await pool.query(
      `INSERT INTO posts (user_id, content, category, is_anonymous, photo, video, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        userId,
        content,
        category || null,
        is_anonymous === 'true' || is_anonymous === true,
        photoFile?.filename || null,
        videoFile?.filename || null
      ]
    );

    // ✅ ENHANCED: Get complete post data with username
    const postWithUser = await pool.query(
      `SELECT 
        posts.id,
        posts.content,
        posts.created_at,
        posts.category,
        posts.is_anonymous,
        posts.photo,
        posts.video,
        users.username
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = $1`,
      [result.rows[0].id]
    );

    console.log('✅ Post created successfully:', {
      id: postWithUser.rows[0].id,
      username: postWithUser.rows[0].username,
      hasPhoto: !!postWithUser.rows[0].photo,
      hasVideo: !!postWithUser.rows[0].video
    });

    res.status(201).json(postWithUser.rows[0]);
  } catch (error) {
    console.error('💥 Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ ENHANCED: GET /posts/:id - Get specific post with media
router.get('/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    console.log(`📡 GET /posts/${postId} - Fetching specific post`);

    const result = await pool.query(
      `SELECT 
        posts.id,
        posts.content,
        posts.created_at,
        posts.category,
        posts.is_anonymous,
        posts.photo,
        posts.video,
        users.username
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = $1`,
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = result.rows[0];
    console.log(`✅ Found post ${postId}:`, {
      username: post.username,
      hasPhoto: !!post.photo,
      hasVideo: !!post.video
    });

    res.json(post);
  } catch (error) {
    console.error(`💥 Error fetching post ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ ENHANCED: DELETE /posts/:id - Delete post and associated media files
router.delete('/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // ✅ ENHANCED: Get post data before deletion to clean up files
    const postResult = await pool.query(
      'SELECT * FROM posts WHERE id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    const post = postResult.rows[0];

    // ✅ ENHANCED: Delete associated media files
    if (post.photo) {
      const photoPath = path.join('uploads', post.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
        console.log(`🗑️ Deleted photo file: ${post.photo}`);
      }
    }

    if (post.video) {
      const videoPath = path.join('uploads', post.video);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
        console.log(`🗑️ Deleted video file: ${post.video}`);
      }
    }

    // Delete post from database
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

    console.log(`✅ Post ${postId} deleted successfully`);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(`💥 Error deleting post ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ ENHANCED: GET /posts/user/:userId - Get posts by specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    console.log(`📡 GET /posts/user/${userId} - Fetching user posts`);

    const result = await pool.query(
      `SELECT 
        posts.id,
        posts.content,
        posts.created_at,
        posts.category,
        posts.is_anonymous,
        posts.photo,
        posts.video,
        users.username
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.user_id = $1
       ORDER BY posts.created_at DESC`,
      [userId]
    );

    console.log(`✅ Found ${result.rows.length} posts for user ${userId}`);
    res.json(result.rows);
  } catch (error) {
    console.error(`💥 Error fetching posts for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ ENHANCED: Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
    return res.status(400).json({ error: error.message });
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

module.exports = router;