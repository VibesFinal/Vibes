const express = require('express');       
const router = express.Router();          
const pg = require('pg');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const routeGuard = require('../middleware/verifyToken');


router.get("/certifications", routeGuard, async (req, res) => {

  // TODO: check req.user.role === "admin"

  //admin check
  const  userId  = req.user.id;

  const user = await pool.query("SELECT role FROM users WHERE id=$1" , [userId]);

  if(!user.rows[0] || user.rows[0].role !== "admin"){

    return res.status(403).json({ error: "Forbidden. Admins only !" })

  }


/*this query is to take the username and email from the person who submitted the certification from

the users table */

  const result = await pool.query(`
    SELECT tc.id, tc.file_path, tc.status, u.username, u.email
    FROM therapist_certifications tc
    JOIN users u ON tc.user_id = u.id
      WHERE tc.status = 'pending'
  `);
  res.json(result.rows);

});

router.put("/certifications/:id", routeGuard, async (req, res) => {

    const  userId  = req.user.id;

    //admin check
    const user = await pool.query("SELECT role FROM users WHERE id=$1" , [userId])


    if(!user.rows[0] || user.rows[0].role !== "admin"){

        return res.status(403).json({ error: "Forbidden. Admins only !" })

    }




  const { id } = req.params;
  const { status } = req.body; // "approved" or "rejected"



  const cert = await pool.query("SELECT user_id FROM therapist_certifications WHERE id = $1", [id]);
  const certuserId = cert.rows[0].user_id;


  await pool.query("UPDATE therapist_certifications SET status=$1 WHERE id=$2", [status, id]);

  if (status === "approved") {

    await pool.query("UPDATE users SET is_therapist=true WHERE id=$1", [certuserId]);

  }

  res.json({ message: `Certification ${status}` });
});

module.exports = router;
