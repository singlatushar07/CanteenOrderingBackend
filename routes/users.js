const express = require("express");
const userrouter = express.Router();
const User = require("../models/user");

userrouter.post("/", (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  console.log(email);

  const user = new User({ email, password });
  user.save();
  res.send("hello");
});

module.exports = userrouter;
