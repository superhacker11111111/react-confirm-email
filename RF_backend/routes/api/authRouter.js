const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../model/User");
const config = require("config");
const router = express.Router();
const authToken = require("../../middleware/authToken");
const authController = require("../../controller/authController");

// initialize
router.get("/initialize/:id", [authToken], authController.initialize);

// sign in/sign up
router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);
router.post("/presignedUrl", authController.getPresignedUrl);
router.post("/deleteFile", authController.deleteS3File);
// verify
router.post("/resendCode", authController.resendCode);
router.post("/verify", authController.verify);
// forgot password
router.post("/forgotpassword", authController.forgetPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/createPassword", authController.createPassword);
router.post("/phoneVerify", authController.phoneVerify);

// app login
router.post("/app/login", authController.appLogin);
router.post("/app/checkNewLogin", authController.checkNewLogin);
router.post("/app/verify", authController.appVerify);

/* =================== Handeling Infinite run: Start ===================  */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

module.exports = router;
