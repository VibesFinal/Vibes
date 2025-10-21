// backend/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error("❌ Backend Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong.",
    type: err.type || "error",
  });
}

module.exports = errorHandler;
