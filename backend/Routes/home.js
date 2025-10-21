const express = require('express');
const router = express.Router();

// Handle GET /
router.get("/", (req, res) => {
  // res.status(200).send("👋 Backend API is running! ");
  res.json({
    success: true,
    message: "👋 Backend API is running!",
    type: "success",
  });
});

module.exports = router;