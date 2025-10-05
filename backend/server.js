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

// ✅ ✅ ✅ INITIALIZE SOCKET.IO MODULES FIRST ✅ ✅ ✅
const initializeSocket = require('./socket/chat');
initializeSocket(io, pool);

const initializeNotifications = require('./socket/notifications');
initializeNotifications(io, pool);

// ✅  Attach io to req
app.use((req, res, next) => {
  req.io = io; // 👈 THIS IS CRITICAL
  next();
});

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
// ROUTES (now safe to load)
// --------------------------

const auth = require("./Routes/auth");
app.use("/user", auth);

const follow = require("./Routes/follow");
app.use("/follow", follow);

const searchRoute = require("./Routes/search");
app.use("/user/search", searchRoute);

const postRoute = require("./Routes/posts");
app.use("/posts", postRoute); // ✅ Now io.emitNotification exists!

const likes = require("./Routes/likes");
app.use("/likes", likes); // ✅ Safe!

const comments = require("./Routes/comments");
app.use("/comments", comments); // ✅ Safe!

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

// Optional: chat history
const chatHistoryRouter = require('./Routes/chatHistory');
app.use('/', chatHistoryRouter);

// Notifications route
const notifications = require('./Routes/notification');
app.use('/notifications', notifications);

//therapists route
const therapist = require("./Routes/therapist");
app.use("/api/therapist" , therapist);
//app.use("/api/therapist", require("./routes/therapist"));

//admin route
const adminRoute = require("./Routes/admin");
app.use("/api/admin", adminRoute);


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