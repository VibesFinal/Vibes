const express = require('express')

const path = require('path');

const app = express()

require('dotenv').config();

const cors = require("cors");

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true
}));


//db requiring
//------------------------

const pg = require("pg");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json())

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

const postRoute = require("./Routes/posts");
app.use("/posts" , postRoute);


const likes = require("./Routes/likes");
app.use("/likes" , likes);


const comments = require("./Routes/comments");
app.use("/comments" , comments)

const profile = require("./Routes/profile")
app.use("/profile" , profile);

const chatRoute = require("./Routes/chatRoute");
app.use("/api/chat" , chatRoute);

const home = require("./Routes/home")
app.use("/",home)
//


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
