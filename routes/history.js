const express = require("express");
const User = require("../models/RegisterSchema");
const router = express.Router();
const { FoodItem } = require("../models/foodItem");
const Admin = require("../models/AdminSchema");
const sendNotification = require("../utility/sendNotification");
const userrouter = require("./RegisterUser");
const { route } = require("./foodItems");

router.get("/history", async (req, res) => {
  const foodItems = await User.find();
  res.send(foodItems);
});

router.post("/user/history", async (req, res) => {
  let user = await User.findOne({ _id: req.body.userId });

  const {
    hall,
    isDelivery,
    payment_method,
    room,
    items,
    totalPrice,
    userId,
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
  await user.save();
  const _id = user.history[0]._id;
  try {
    let admin = await Admin.findOne({ hall: hall });
    admin.pending.unshift({
      isDelivery,
      items,
      payment_method,
      room,
      totalPrice,
      userId,
      _id,
    });
    await admin.save();
    const token = admin.expoNotificationToken;
    sendNotification(
      token,
      "New Order",
      `A new order is placed by ${user.name}`
    );
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

router.get("/admin/history/:id", async (req, res) => {
  let admin = await Admin.findById(req.params.id);
  admin = admin.toObject();
  for (var i = 0; i < admin.history.length; i++) {
    for (var j = 0; j < admin.history[i].items.length; j++) {
      let item = await FoodItem.findById(
        admin.history[i].items[j].id
      ).map((item) => item.toObject());
      item.quantity = admin.history[i].items[j].quantity;
      admin.history[i].items[j] = item;
      const user = await User.findById(admin.history[i].userId);
      admin.history[i].userEmail = user.email;
    }
  }

  res.send(admin.history);
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

    var response = {
      success: true,
      list: list,
    };
    return res.status(200).json(response);
  }
});
// gives
router.get("/admin/fetch-paginated-data/:hall", async (req, res) => {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  // var user = await User.find({ hall: req.params.hall });
  var admin = await Admin.findOne({ hall: req.params.hall });
  let userIds = new Set();
  for (let i = 0; i < admin.history.length; i++) {
    userIds.add(admin.history[i].userId);
  }
  userIds = [...userIds];
  let users = await User.find({
    _id: {
      $in: userIds,
    },
  });
  // user = user.history;
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
    for (var i = 0; i < pageSize; i++) {
      if (index > users.length) break;
      list.unshift({
        name: users[index - 1].name,
        id: users[index - 1].id,
        room: users[index - 1].room,
      });
      index++;
    }

    var response = {
      success: true,
      list: list,
    };
    return res.status(200).json(response);
  }
});

// gives data
router.get("/admin_user/fetch-paginated-data/:id/:hall", async (req, res) => {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var user = await User.findById(req.params.id);

  user2 = user.history;
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
    for (var i = 0; i < pageSize; i++) {
      if (index > user2.length) break;
      if (
        user2[index - 1].orderStatus != 0 &&
        user2[index - 1].hall == req.params.hall
      ) {
        for (var j = 0; j < user2[index - 1].items.length; j++) {
          let item = await FoodItem.findById(
            user2[index - 1].items[j].id
          ).map((item) => item.toObject());
          item.quantity = user2[index - 1].items[j].quantity;
          user2[index - 1].items[j] = item;
        }
        list.push(user2[index - 1]);
      }
      // let k = user2.find(({ orderStatus }) => orderStatus == 1 )

      index++;
    }

    var response = {
      success: true,
      list: list,
    };
    return res.status(200).json(response);
  }
});

router.get("/admin/pending/:id", async (req, res) => {
  // try {
  var orderStatus = parseInt(req.query.orderStatus);
  var orderId = req.query.orderId;

  var admin = await Admin.findById(req.params.id);
  function findIndexandData(c, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]._id == orderId) {
        var order = { data: arr[i], index: i };
        return order;
      }
    }
  }

  var order = findIndexandData(orderId, admin.pending);

  order.data.orderStatus = orderStatus;

  admin.history.unshift(order.data);
  admin.pending.splice(order.index, 1);
  await admin.save();

  var customer = await User.findById(admin.history[0].userId);
  customerorder = findIndexandData(orderId, customer.history);
  customerorder.data.orderStatus = orderStatus;
  await customer.save();
  const token = customer.expoNotificationToken;
  const orderStatusString = orderStatus == 1 ? "rejected" : "accepted";

  sendNotification(
    token,
    "Order status updated",
    `Your order is ${orderStatusString} by the canteen owner.`
  );
  res.send("order confirmed");
  // } catch (err) {
  //   res.status(400).send(JSON.parse("Error Occured"));
  // }
});

router.get("/admin/pendingOrders/:id", async (req, res) => {
  const user = await Admin.findById(req.params.id);
  for (var i = 0; i < user.pending.length; i++) {
    for (var j = 0; j < user.pending[i].items.length; j++) {
      let item = await FoodItem.findById(
        user.pending[i].items[j].id
      ).map((item) => item.toObject());
      item.quantity = user.pending[i].items[j].quantity;
      user.pending[i].items[j] = item;
    }
  }

  res.send(user.pending);
});
module.exports = router;
