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
  console.log(req.body);
  // res.send(JSON.stringify(req.body));

  let user = await User.findById(req.body.id);
  console.log(user);
  if (!user) {
    res.status(400).send("User Not Found. Firstly Register Yourself");
  } else {
    if (user.otp == req.body.otp) {
      user.isVerified = true;
      user.otp = null;
      await user.save();
      const token = user.generateAuthToken();
      res
        .header("x-auth-token", token)
        .status(200)
        .send(
          JSON.stringify(_.pick(user, ["_id", "email", "name", "isVerified"]))
        );
    } else {
      res.status(401).send(JSON.stringify({ isVerified: false }));
    }
  }
});
verificationrouter.post("/verify/resend", async (req, res) => {
  console.log(req.body);
  let user = await User.findById(req.body.id);

  console.log(user._id);
  mail(user.name, user.otp, user.email);

  const token = user.generateAuthToken();
  res.status(200).send("done");
});

// "confirmPassword": "gggggggg",
// "email": "a@f.com",
// "hall": "13",
// "name": "Fr",
// "password": "gggggggg",
// "rollNo": "",
// "room": "Vg",

module.exports = verificationrouter;
