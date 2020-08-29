const express = require("express");
const verificationrouter = express.Router();
const User = require("../models/RegisterSchema");
const { json } = require("body-parser");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require("dotenv").config();

const nodemailer = require("nodemailer");
const { getMaxListeners } = require("npm");
const mail = require("../middleware/mail");

verificationrouter.post("/user/verify", async (req, res) => {
  let user = await User.findById(req.body.id);
  console.log(req.body);
  if (!user) {
    res.status(400).send("User Not Found. Firstly Register Yourself");
  } else {
    if (user.otp == req.body.otp) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
      const token = user.generateAuthToken();
      res.header("x-auth-token", token).status(200).send(JSON.stringify(user));
    } else {
      res.status(401).send(JSON.stringify({ isVerified: false }));
    }
  }
});
verificationrouter.post("/user/verify/resend", async (req, res) => {
  console.log(req.body);
  let user = await User.findById(req.body.id);

  mail(user.name, user.otp, user.email);

  const token = user.generateAuthToken();
  res.status(200).send("Check your inbox for otp.");
});

verificationrouter.post("/user/verify/forget", async (req, res) => {
  let user = await User.findById(req.body.id);
  console.log(req.body);
  if (!user) {
    res.status(400).send("User Not Found. Firstly Register Yourself");
  } else {
    if (user.otp == req.body.otp) {
      user.otp = null;
      await user.save();
      const token = user.generateAuthToken();
      user = user.toObject();
      user.isChangePassword = true;
      console.log("gfhjf", user);
      res.header("x-auth-token", token).status(200).send(JSON.stringify(user));
    } else {
      res.status(401).send(JSON.stringify({ isVerified: false }));
    }
  }
});

verificationrouter.put("/user/verify/forget", async (req, res) => {
  let user = await User.findById(req.body.id);
  let token = req.body.token;
  const newPassword = req.body.newPassword;
  try {
    const decoded = jwt.verify(token, "nikhil");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.send("Successfully changed password");
    console.log(user);
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
});

module.exports = verificationrouter;
