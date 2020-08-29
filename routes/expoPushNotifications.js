const express = require("express");
const router = express.Router();
const User = require("../models/RegisterSchema");
const Admin = require("../models/AdminSchema");

router.post("/user/expoPushTokens", async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      expoNotificationToken: req.body.token,
    }
  );
  console.log(user);
  res.send("Token set successfully");
});

router.post("/admin/expoPushTokens", async (req, res) => {
  const user = await Admin.findOneAndUpdate(
    { _id: req.user._id },
    {
      expoNotificationToken: req.body.token,
    }
  );
  console.log(user);
  res.send("Token set successfully");
});

module.exports = router;
