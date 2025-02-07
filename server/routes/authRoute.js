const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyUserEmail,
  resetPassOtp,
  resetPassword
} = require("../controller/authController");

const { getUserIdFromCookie } = require("../middleware/getUserIdFromCookie");

router.get("/signup", (req, res) => {
  res.send("register user form");
});

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/getotp", getUserIdFromCookie, sendVerifyOtp);
router.post("/verify", getUserIdFromCookie, verifyUserEmail);

router.post("/send-reset-otp", resetPassOtp);
router.post("/reset-pass",resetPassword)

module.exports = router;
