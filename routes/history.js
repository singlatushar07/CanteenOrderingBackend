const express = require("express");
const HistorySchema = require("../models/RegisterSchema");
const router = express.Router();
const { FoodItem } = require("../models/foodItem");
const { findById } = require("../models/RegisterSchema");
router.post("/history", async (req, res) => {
  let user = await HistorySchema.findOne({ _id: req.body.id });

  console.log(req.body);

  console.log(user);
  const {
    hall,
    isDineIn,
    payment_method,
    room,
    items,
    time,
    totalPrice,
  } = req.body;

  user.history.push({
    hall,
    isDineIn,
    items,
    payment_method,
    room,
    totalPrice,
  });

  await user.save();
  res.status(200).send(user);
});

router.get("/history/:id", async (req, res) => {
  const user = await HistorySchema.findById(req.params.id);

  for (var i = 0; i < user.history.length; i++) {
    for (var j = 0; j < user.history[i].items.length; j++) {
      const item = await FoodItem.findById(user.history[i].items[j].id);
      user.history[i].items[j] = item;
    }
  }
  res.status(200).send(user.history);
});
module.exports = router;
