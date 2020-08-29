const express = require("express");
const User = require("../models/RegisterSchema");
const router = express.Router();
const { FoodItem } = require("../models/foodItem");
const Admin = require("../models/AdminSchema");
const sendNotification = require("../utility/sendNotification");

router.get("/history", async (req, res) => {
  const foodItems = await User.find();
  console.log(foodItems);
  res.send(foodItems);
});

router.post("/user/history", async (req, res) => {
  let user = await User.findOne({ _id: req.body.userId });

  console.log(req.body);

  const {
    hall,
    isDelivery,
    payment_method,
    room,
    items,
    totalPrice,
  } = req.body;
  user.history.unshift({
    hall,
    isDelivery,
    items,
    payment_method,
    room,
    totalPrice,
  });
  if (payment_method == "account") user.Pending = user.Pending + totalPrice;
  console.log(user);
  await user.save();
  try {
    console.log(typeof hall);
    let admin = await Admin.findOne({ hall: hall });
    console.log(admin);
    admin.history.unshift({
      isDelivery,
      items,
      payment_method,
      room,
      totalPrice,
    });
    await admin.save();
    const token = admin.expoNotificationToken;
    sendNotification(token, "Successful", "Your order is placed");
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("error occured");
  }
});

router.get("/user/history/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  for (var i = 0; i < user.history.length; i++) {
    for (var j = 0; j < user.history[i].items.length; j++) {
      let item = await FoodItem.findById(
        user.history[i].items[j].id
      ).map((item) => item.toObject());
      item.quantity = user.history[i].items[j].quantity;
      user.history[i].items[j] = item;
    }
  }

  res.send(user.history);
});

router.get("/user/:id/fetch-paginated-data", async (req, res) => {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var user = await User.findById(req.params.id);
  user = user.history;
  //checking if page number is invalid
  if (pageNo <= 0) {
    var response = {
      success: false,
      message: "Invalid Page Number",
    };
    return res.status(200).json(response);
  } else {
    //fetch data from database based on given page no and page size
    var index = parseInt(pageNo - 1) * parseInt(pageSize) + 1;
    var list = [];
    console.log(user.length);
    for (var i = 0; i < pageSize; i++) {
      if (index > user.length) break;
      for (var j = 0; j < user[index - 1].items.length; j++) {
        let item = await FoodItem.findById(
          user[index - 1].items[j].id
        ).map((item) => item.toObject());
        item.quantity = user[index - 1].items[j].quantity;
        user[index - 1].items[j] = item;
      }
      list.push(user[index - 1]);
      index++;
    }

    console.log(list);
    var response = {
      success: true,
      list: list,
    };
    return res.status(200).json(response);
  }
});
module.exports = router;
