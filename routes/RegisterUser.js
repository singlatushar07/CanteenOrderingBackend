const express = require("express");
const userrouter = express.Router();
const User = require("../models/RegisterSchema");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require("dotenv").config();
const mail = require("../middleware/mail");
const multer = require("multer");
const upload = multer({ dest: "/tmp/upload/" });

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
const Admin = require("../models/AdminSchema");
userrouter.post("/user/register", upload.single("image"), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (user && user.isVerified) {
    res.status(400).send("User is already registered");
  } else {
    const OTP = otp();
    console.log(OTP);
    if (user) user.remove();

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
    } catch (err) {
      console.error(err);
    }

    user.otp = OTP;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    console.log(user);
    mail(user.name, OTP, user.email);

    const token = user.generateAuthToken();
    res.status(200).send(_.pick(user, ["_id", "email", "name"]));
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

userrouter.delete("/register/delete", async (req, res) => {
  const a = await User.deleteMany();
  res.send(a);
});

userrouter.put("/register", upload.single("image"), async (req, res) => {
  const fileStr = req.file.path;
  const uploadResponse = await cloudinary.uploader.upload(fileStr, {
    folder: "Users",
  });
  console.log(uploadResponse);
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      mobile: req.body.mobile,
      imagePath: uploadResponse.url,
    }
  );
  console.log(user);

  res.send(user);
});

userrouter.put("/register/changepassword", async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      mobile: req.body.mobile,
      imagePath: uploadResponse.url,
    }
  );
  console.log(user);

  res.send(user);
});

userrouter.post("/register/forget", async (req, res) => {
  const OTP = otp();
  console.log(OTP);
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      otp: OTP,
    }
  );
  if (user) {
    mail(user.name, OTP, user.email);
  } else {
    return res.status(404).send("User not found");
  }
  const response = _.pick(user, ["name", "_id", "email"]);
  response.isChangePassword = true;
  res.send(response);
});

userrouter.post("/admin/register", upload.single("image"), async (req, res) => {
  let user = await Admin.findOne({ email: req.body.email });
  console.log(user);
  if (user) {
    res.status(400).send("User is already registered");
  } else {
    try {
      const fileStr = req.file.path;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: "Admins",
      });
      console.log(uploadResponse.url);
      user = new Admin(
        Object.assign(
          _.pick(req.body, ["hall", "email", "name", "password", "mobile"]),
          {
            imagePath: uploadResponse.url,
          }
        )
      );
    } catch (err) {
      console.error(err);
    }

    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    console.log(user);
    

    const token = user.generateAuthToken();
    res.status(200).send(_.pick(user, ["_id", "email", "name"]));
  }
});

module.exports = userrouter;
