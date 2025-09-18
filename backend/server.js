const express = require('express')

const path = require('path');

const app = express()

require('dotenv').config();

const cors = require("cors");
app.use(express.json())

const corsOptions = {
  origin: [
    "http://localhost:3000", // 👈 Your React frontend (default Vite port)
    "http://localhost:4000"  // 👈 Optional: if you have another frontend or test app
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
};

app.use(cors(corsOptions));

/*app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true
}));*/


//db requiring
//------------------------

const pg = require("pg");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });



//--------------------------

const PORT = process.env.PORT ||3000;

//important routes--------------------------------

//
const auth = require("./Routes/auth");
app.use("/user" , auth);

// follow route
const follow = require("./Routes/follow");
app.use("/follow" , follow);

// search user
const searchRoute = require("./Routes/search");
app.use("/user/search", searchRoute);

//post route
const postRoute = require("./Routes/posts");
app.use("/posts" , postRoute);

//likes route
const likes = require("./Routes/likes");
app.use("/likes" , likes);

//comments route
const comments = require("./Routes/comments");
app.use("/comments" , comments)

//profile route
const profileRoute = require("./Routes/profile");
app.use("/profile", profileRoute); 

//chatbot route
const chatRoute = require("./Routes/chatRoute");
app.use("/api/chat" , chatRoute);

//home route
const home = require("./Routes/home");
app.use("/" , home)

//communities route
const communities = require("./Routes/communities");
app.use("/communities" , communities)

//upload the photos and the videos
app.use("/uploads", express.static("uploads"));



//listening to the port with connecting it with the database server
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
          `Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`
        );
 
        console.log(`App listening on port http://localhost:${PORT}`);
      });
  })
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });
