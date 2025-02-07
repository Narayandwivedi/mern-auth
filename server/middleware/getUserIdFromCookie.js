const jwt = require("jsonwebtoken");

function getUserIdFromCookie(req, res, next) {

  
    const { token } = req.cookies;

    // check user is logined or not
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    }


    try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!decodedToken){
      res.json({success:false , message:"please login"})
    }
    req.body.userId = decodedToken.id;

    next();
  } catch (error) {
    console.error(`Error in authentication middleware: ${error.message}`);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
  }
}

module.exports = { getUserIdFromCookie };
