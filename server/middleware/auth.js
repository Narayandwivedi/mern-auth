const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
  try {
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, message: "Please log in to continue." });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to req
    req.user = decodedToken;

    next(); // Proceed to the next middleware

  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

module.exports = { isLoggedIn };
