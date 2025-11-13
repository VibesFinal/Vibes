const express = require('express');
const http = require('http');
const path = require('path');
require('dotenv').config();
const cors = require("cors");
const pg = require("pg");
const errorHandler = require("./middleware/errorHandler");

// App & server setup
const app = express();
const server = http.createServer(app);

// ✅ Get allowed origins from environment variable or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      "http://localhost:3000",
      "http://localhost:4000",
      "https://vibes-frontend-8jla.onrender.com"
    ];

console.log('🌐 Allowed CORS origins:', allowedOrigins);

const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// PostgreSQL
const isProduction = process.env.NODE_ENV === "production";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// ✅ ✅ ✅ SOCKET.IO NAMESPACES SETUP ✅ ✅ ✅
// Public community chat (no auth)
const communityNamespace = io.of('/community');
require('./socket/chat')(communityNamespace, pool);

// Private 1:1 chat (with auth)
const privateNamespace = io.of('/private-chat');
require('./socket/privateChat')(privateNamespace, pool);

// Notifications (global namespace, no auth needed)
require('./socket/notifications')(io, pool);

// ✅ Attach io to req (for HTTP routes that emit notifications)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// --------------------------
// ROUTES
// --------------------------

const auth = require("./Routes/auth");
app.use("/user", auth);

const follow = require("./Routes/follow");
app.use("/follow", follow);

const searchRoute = require("./Routes/search");
app.use("/user/search", searchRoute);

const postRoute = require("./Routes/posts");
app.use("/posts", postRoute);

const likes = require("./Routes/likes");
app.use("/likes", likes);

const comments = require("./Routes/comments");
app.use("/comments", comments);

const profileRoute = require("./Routes/profile");
app.use("/profile", profileRoute);

const badgeRoute = require('./Routes/badges');
app.use('/badges', badgeRoute);

const chatRoute = require("./Routes/chatRoute");
app.use("/api/chat", chatRoute);

const verify = require("./Routes/verify");
app.use('/user/verify', verify); 

const home = require("./Routes/home");
app.use("/", home);

const communities = require("./Routes/communities");
app.use("/communities", communities);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const aiAnalysisRoute = require("./Routes/AiAnalysis");
app.use("/ai", aiAnalysisRoute);

// Chat history (public community messages)
const chatHistoryRouter = require('./Routes/chatHistory');
app.use('/', chatHistoryRouter);

// Private chat history
const privateChatHistory = require('./Routes/privateChatHistory');
app.use('/private', privateChatHistory);

// Admin route
const adminRoute = require("./Routes/admin");
app.use("/api/admin", adminRoute);

// Notifications route
const notifications = require('./Routes/notification');
app.use('/notifications', notifications);

// Therapists route
const therapist = require("./Routes/therapist");
app.use("/api/therapist", therapist);

app.use(errorHandler);

// --------------------------
// START SERVER
// --------------------------

const PORT = process.env.PORT || 3000;

pool
  .connect()
  .then((client) => {
    return client
      .query("SELECT current_database(), current_user")
      .then((res) => {
        client.release();

        const dbName = res.rows[0].current_database;
        const dbUser = res.rows[0].current_user;

        console.log(
          `✅ Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`
        );

        server.listen(PORT, () => {
          console.log(`🚀 Express + Socket.io server running on http://localhost:${PORT}`);
          console.log(`💬 Real-time community chat system initialized`);
        });
      });
  })
  .catch((err) => {
    console.error("❌ Could not connect to database:", err);
    process.exit(1);
  });
