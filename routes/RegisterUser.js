const express = require("express");
const userrouter = express.Router();
const User = require("../models/RegisterSchema");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require("dotenv").config();
const mail = require("../middleware/mail");
//muler
const multer = require("multer");
const upload = multer({ dest: "upload/" });

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "anam",
  api_key: "531277261252188",
  api_secret: "YWc1GhUuPcOFDGapf-mhpGWo6co",
});

userrouter.route("/me").get(auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
const otp = require("../middleware/otpgenerate");
userrouter.post("/register", upload.single("image"), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    res.status(400).send("user already registered");
  } else {
    var OTP = otp();
    console.log(OTP);

    try {
      const fileStr = req.file.path;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: "Users",
      });
      console.log(uploadResponse.url);
      user = new User(
        Object.assign(
          _.pick(req.body, [
            "hall",
            "email",
            "name",
            "password",
            "rollNo",
            "room",
            "mobile",
          ]),
          {
            imagePath: uploadResponse.url,
          }
        )
      );
      //res.json({ msg: "yaya" });
    } catch (err) {
      console.error(err);
      // res.status(500).json({ err: 'Something went wrong' });
    }

    user.otp = OTP;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    console.log(user);
    mail(user.name, OTP, user.email);

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .status(200)
      .send(_.pick(user, ["_id", "email", "name"]));
  }
});
userrouter.put("/register/delete", async (req, res) => {
  console.log(req.body.id);

  try {
    const user = await User.findByIdAndRemove(req.body.id);
    if (!user)
      return res.status(404).send("The item with the given ID was not found.");

    res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
});
// "confirmPassword": "gggggggg",
// "email": "a@f.com",
// "hall": "13",
// "name": "Fr",
// "password": "gggggggg",
// "rollNo": "",
// "room": "Vg",

module.exports = userrouter;
