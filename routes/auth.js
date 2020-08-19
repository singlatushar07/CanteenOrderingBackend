const express = require("express");
const authrouter = express.Router();
const User = require("../models/RegisterSchema");
const { json } = require("body-parser");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
authrouter.route("/").post(async (req, res) => {
  console.log(req.body);

  let user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return res.status(400).send("Invalid E-mail or Password.");
  } else {
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send("Invalid E-mail or Password.");
  }
  const token = user.generateAuthToken();
  res.send(token);
});

// "confirmPassword": "gggggggg",
// "email": "a@f.com",
// "hall": "13",
// "name": "Fr",
// "password": "gggggggg",
// "rollNo": "",
// "room": "Vg",

module.exports = authrouter;
