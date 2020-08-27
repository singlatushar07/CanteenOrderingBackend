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

verificationrouter.post("/verify", async (req, res) => {
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
verificationrouter.post("/verify/resend", async (req, res) => {
  console.log(req.body);
  let user = await User.findById(req.body.id);

  mail(user.name, user.otp, user.email);

  const token = user.generateAuthToken();
  res.status(200).send("Check your inbox for otp.");
});

verificationrouter.post("/verify/forget", async (req, res) => {
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

module.exports = verificationrouter;
