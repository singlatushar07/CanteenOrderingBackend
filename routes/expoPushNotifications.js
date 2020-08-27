const express = require("express");
const router = express.Router();
const User = require("../models/RegisterSchema");

router.post("/", async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      expoNotificationToken: req.body.token,
    }
  );
  console.log(user);
  res.send("Token set successfully");
});

module.exports = router;
