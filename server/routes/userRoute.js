const express = require("express");
const router = express.Router();

const {getUserData} = require("../controller/userController")

const {getUserIdFromCookie} =  require("../middleware/getUserIdFromCookie")

router.get("/data",getUserIdFromCookie, getUserData )

module.exports = router;