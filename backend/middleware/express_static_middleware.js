// Express Static File Middleware Configuration
// Add this to your main Express app file (usually app.js or server.js)

const express = require('express');
const path = require('path');
const fs = require('fs');

// ✅ CRITICAL: Static file serving middleware
const setupStaticFileServing = (app) => {
  console.log("🔧 Setting up static file serving...");

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("📁 Created uploads directory:", uploadsDir);
  } else {
    console.log("📁 Uploads directory exists:", uploadsDir);
  }

  // ✅ CRITICAL: Serve static files from uploads directory
  app.use('/uploads', express.static(uploadsDir, {
    // Enable CORS for media files
    setHeaders: (res, path, stat) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      console.log(`📤 Serving static file: ${path}`);
    },
    // Handle 404s gracefully
    fallthrough: false
  }));

  // ✅ DEBUG: Add middleware to log all requests to /uploads
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    const fileExists = fs.existsSync(filePath);
    
    console.log(`🔍 Static file request:`, {
      url: req.url,
      path: req.path,
      fullPath: filePath,
      exists: fileExists,
      method: req.method
    });

    if (!fileExists && req.method === 'GET') {
      console.log(`❌ File not found: ${filePath}`);
      return res.status(404).json({
        error: 'File not found',
        path: req.path,
        fullPath: filePath
      });
    }

    next();
  });

  // ✅ DEBUG: Add endpoint to list all uploaded files
  app.get('/api/debug/uploads', (req, res) => {
    try {
      const files = fs.readdirSync(uploadsDir);
      const fileInfo = files.map(filename => {
        const filePath = path.join(uploadsDir, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          url: `/uploads/${filename}`
        };
      });

      console.log(`📊 Found ${files.length} uploaded files`);
      res.json({
        uploadsDir,
        totalFiles: files.length,
        files: fileInfo
      });
    } catch (error) {
      console.error("💥 Error listing uploads:", error);
      res.status(500).json({ error: "Failed to list uploads" });
    }
  });

  console.log("✅ Static file serving configured");
};

// ✅ USAGE: Add this to your main app file
/*
const express = require('express');
const app = express();

// Import and use the static file setup
const { setupStaticFileServing } = require('./express_static_middleware');
setupStaticFileServing(app);

// Your other middleware and routes...
app.use('/api/posts', require('./routes/posts'));
app.use('/api/reactions', require('./routes/reactions'));

app.listen(7777, () => {
  console.log('Server running on port 7777');
});
*/

module.exports = { setupStaticFileServing };

// ✅ ALTERNATIVE: If you prefer to add directly to your main app file:
/*
// Add these lines to your main Express app file:

const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  }
}));

// Debug endpoint to list uploaded files
app.get('/api/debug/uploads', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileInfo = files.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        url: `/uploads/${filename}`
      };
    });
    res.json({ totalFiles: files.length, files: fileInfo });
  } catch (error) {
    res.status(500).json({ error: "Failed to list uploads" });
  }
});
*/
