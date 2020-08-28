const express = require("express");
const authrouter = express.Router();
const User = require("../models/RegisterSchema");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
authrouter.route("/user/auth").post(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return res.status(400).send("Invalid E-mail or Password.");
  } else {
    if (!user.isVerified) {
      res.status(400).send(`${user.email}  is not verified.`);
    } else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(400).send("Invalid E-mail or Password.");
      } else {
        const token = user.generateAuthToken();
        res.send(token);
      }
    }
  }
});
authrouter.route("/admin/auth").post(async (req, res) => {
  let user = await Admin.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return res.status(400).send("Invalid E-mail or Password.");
  } else {
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid E-mail or Password.");
    } else {
      const token = user.generateAuthToken();
      res.send(token);
    }
  }
});

module.exports = authrouter;
