const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const express = require('express');

const router = express.Router();

const routeGuard = require('../middleware/verifyToken');

require('dotenv').config();

//we also want to reqire the database because we need to store the users data inside of it
//-----------------------------------
//db requiring
const pg = require("pg");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

//-------------------------------------

//register
router.post('/register' , async (req , res) => {


    const {username , email , password} = req.body;

    if(!username || !email || !password){


        return res.status(400).send("username , email , password are required");

    }

    try {

        //let's hash the password
        const hashedpassword = await bcrypt.hash(password , 10);

        const result = await pool.query(

          "INSERT INTO users (username , email , password) VALUES ($1 , $2 , $3)  RETURNING id , username, email",

          [username , email , hashedpassword]


        );

        res.status(201).json(result.rows[0]);
        
    } catch (error) {

        console.error("error inserting user " , error);

        if(error.code === '23505'){

            res.status(409).send("username already exists");

        } else if(error.detail.includes("email")){

            res.status(500).send("error" + error.message)

        }
        
    }


});

router.post("/login" , async (req , res) => {

    const { username , password } = req.body;

    try {
        
        const userResult = await pool.query(

            `SELECT * FROM users WHERE username = $1`,

            [username]

        );

        const user = userResult.rows[0];

        //
        const isMatched = await bcrypt.compare(password , user.password);

        if(!isMatched){

            return res.status(401).send("invalid credentials");

        }

        //tokenization
        const token = jwt.sign(

            {id: user.id , username: user.username},

            process.env.JWT_SECRET,

            {expiresIn: "2h"}

        );

        res.send( { token } );

    } catch (error) {

        console.error(error , "error logging in");
        
        res.status(500).send("error" , error.message)        
        
    }

});

router.get("/profile" , routeGuard , async (req , res) => {

    try {
        
        const userId = req.user.id;

        const result = await pool.query("SELECT username , email FROM users WHERE id = $1" , 

          [userId]

        );

        if(result.rows.length === 0){

            return res.status(400).send("user not found");

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.log(" error fetching profile ", error);
        
        res.status(500).send("server error");
        
    }

});

module.exports = router;