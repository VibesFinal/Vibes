const jwt = require("jsonwebtoken");

require('dotenv').config();


//or we can name the function verifyToken()
function routeGuard(req , res , next){  /* we used next to make the function continue and pass it to the
                                            other middlewares to make it work */

    const authHeader = req.headers["authorization"]

    const tokenFromHeader = authHeader && authHeader.split(" ")[1]; // here we are splitting the token

    const tokemFromQuery = req.query.token;

    const token = tokenFromHeader || tokemFromQuery;

    if(!token){  // if the token is not valid return this

        return res.status(401).send("No Token provided , Access Denied")

    }

    try { // decode
        
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decode

        next();

    } catch (error) {

        return res.status(403).send("invalid or expired token");
        
    }

}

module.exports = routeGuard;