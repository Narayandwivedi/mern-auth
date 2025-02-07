const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user");
const transporter = require("../config/nodemailer");

// user signup

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPass });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set authentication cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send welcome email
    const mailOptions = {
      from: "desinplus1@gmail.com", // Must match verified SMTP email
      to: email,
      subject: "Welcome to FinanceKeeda!",
      text: "Welcome to FinanceKeeda! We hope to reach new milestones and achieve a brighter tomorrow together.",
      html: `<h2>Welcome to FinanceKeeda!</h2><p>We hope to reach new milestones and achieve a brighter tomorrow together.</p>`,
    };

    await transporter.sendMail(mailOptions, (err, info) => {
      err ? console.log(err) : console.log(info);
    });

    return res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
}

// user login

async function loginUser(req, res) {
  const { email, password } = req.body;

  //  check email or pass is send by user or not
  if (!email || !password) {
    return res.json({ success: false, message: "email or pass missing" });
  }

  try {
    const user = await userModel.findOne({ email });

    // check email is valid or not
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    // check pass match ot not
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.json({ success: false, message: "password is incorrect" });
    }

    // sneding jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, message: "user logged in success" });
  } catch (err) {
    return res.json({
      success: false,
      message: "some error occured while login",
    });
  }
}

//  user logout

async function logoutUser(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "logout successfully" });
  } catch (err) {
    return res.json({
      success: false,
      message: `unable to logout user ${err.message}`,
    });
  }
}

// send verification otp to the user email

async function sendVerifyOtp(req, res) {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    // Fetch user from database
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if the user is already verified
    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified." });
    }

    // Generate a 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Store OTP and expiration time
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    await user.save();

    // Mail options
    const mailOptions = {
      from: "desinplus1@gmail.com",
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP for account verification is: ${otp}. It will expire in 10 minutes.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while sending the OTP. Please try again later.",
    });
  }
}

// verify user account

async function verifyUserEmail(req, res) {
  try {
    const { otp, userId } = req.body;

    // Validate input
    if (!otp || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid userId and OTP.",
      });
    }

    // Fetch user from database
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // check user already verified

    if (user.isVerified) {
      return res.json({ success: false, message: "user already verified" });
    }

    // Check if OTP is expired
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.verifyOtp === otp.trim()) {
      user.isVerified = true;
      user.verifyOtp = "";
      user.verifyOtpExpireAt = 0;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "User verified successfully." });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP. Please try again." });
  } catch (err) {
    console.error("Error verifying user email:", err);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred during account verification. Please try again later.",
    });
  }
}

//  reset password - send otp

async function resetPassOtp(req, res) {
  try {
    const { email } = req.body;
    //  checks input
    if (!email) {
      return res.json({ success: false, message: "please provide email id" });
    }

    // fetch user from db

    const user = await userModel.findOne({ email });

    // checks user
    if (!user) {
      return res.json({
        success: false,
        message: "the user with this email is not found",
      });
    }

    // generate otp

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    // send otp

    const mailOptions = {
      from: "desinplus1@gmail.com",
      to: `${user.email}`,
      subject: "otp for password reset",
      text: `your otp for password reset is : ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "password reset otp send successfully",
    });
  } catch (err) {
    console.log(`some error while sending `);
    return res.json({ success: false, message: "some unexpected error" });
  }
}

// reset password - verify otp

async function resetPassword(req, res) {
  const { email, otp, newPass } = req.body;

  // checks user input
  if (!otp || !email || !newPass) {
    return res.json({ success: false, message: "missing details "});
  }

  try{

    //  find user in db
      const user = await userModel.findOne({email});
      if(!user){return res.json({success:false , message:"user with this email doesn't exist"})}

      //  check otp expires or not
      if(user.resetOtpExpireAt<Date.now()){
        return res.json({success:false , message:"otp expired"})
      }
      if(otp === user.resetOtp){
        newHashedPass = await bcrypt.hash(newPass , 10);
        user.password = newHashedPass;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({success:true , message:"Your passwprd updated successfully"})

      }
      return res.json({success:false , message:"please provide valid otp"})

      
      
  }
  catch(err){

  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyUserEmail,
  resetPassOtp,
  resetPassword
};
