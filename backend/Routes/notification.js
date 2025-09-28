const express = require('express');

const router = express.Router();

const pg = require('pg');

const routeGuard = require('../middleware/verifyToken');


const pool = new pg.Pool( { connectionString: process.env.DATABASE_URL } );

// GET /api/notifications/unread/:userId
router.get('/unread/:userId', async(req,res) =>{

    try{

        const {userId}= req.params;

         // Basic validation
        if(!userId|| isNaN(userId)){

          res.status(400).json({error: "Invaild userId"})

        }

        const result = await pool.query (

        'SELECT * FROM notifications WHERE USer_Id = $1 AND is_read = false ORDER BY created_at DESC ',

        [parseInt(userId,10)]
    );
    
    res.json(result.rows)
    
  }catch(err){

   console.error('Error fetching notifications:', err)

   res.status(500).json({ error: 'Server error' })
 }

});  

 // PATCH /api/notifications/read/:id
router.patch('/read/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    const result = await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING id',
      [parseInt(id, 10)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;