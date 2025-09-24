const express = require('express');
const http = require('http');
const path = require('path');
require('dotenv').config();
const cors = require("cors");
const pg = require("pg");

// App & server setup
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:4000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// PostgreSQL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Middleware
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:4000"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// --------------------------
// ROUTES
// --------------------------

//
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

// verify route
const verify = require("./Routes/verify");
app.use('/user/verify', verify); 

const home = require("./Routes/home");
app.use("/", home);

const communities = require("./Routes/communities");
app.use("/communities", communities);

app.use("/uploads", express.static("uploads"));

const aiAnalysisRoute = require("./Routes/AiAnalysis");
app.use("/ai", aiAnalysisRoute);

// ✅ Import and initialize Socket.io logic
const initializeSocket = require('./socket/chat'); // ← adjust path if needed
initializeSocket(io, pool); // 👈 Pass io and pool

// ✅ Optional: Import chat history route
const chatHistoryRouter = require('./Routes/chatHistory'); // ← if you created it
app.use('/', chatHistoryRouter); // mounts /communities/:id/messages

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