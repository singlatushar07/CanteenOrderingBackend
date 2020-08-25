const { FoodItem, validate } = require("../models/foodItem");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const foodItems = await FoodItem.find().sort("hall");
  console.log(foodItems);
  res.send(foodItems);
});

router.get("/:hall", async (req, res) => {
  const foodItems = await FoodItem.find({ hall: req.params.hall }).sort(
    "category"
  );
  console.log(foodItems);
  res.send(foodItems);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let foodItem = new FoodItem(req.body);
  foodItem = await foodItem.save();

  res.send(foodItem);
});

router.delete("/", [auth, admin], async (req, res) => {
  const a = await FoodItem.deleteMany();
  res.send(a);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const foodItem = await FoodItem.findByIdAndRemove(req.params.id);

  if (!foodItem)
    return res.status(404).send("The item with the given ID was not found.");

  res.send(foodItem);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foodItem = await FoodItem.findByIdAndUpdate(
    req.params.id,
    {
      category: req.body.category,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      hall: req.body.hall,
    },
    {
      new: true,
    }
  );

  if (!foodItem)
    return res.status(404).send("The item with the given ID was not found.");

  res.send(foodItem);
});

// Object : {"hall": 2,
// "isDineIn": false,
// "items": Array [
//   Object {
//     "id": "5f36ac6211aadbd1d82da6e4",
//     "quantity": 1,
//   },
//   Object {
//     "id": "5f36ac1d11aadbd1d82da6e1",
//     "quantity": 1,
//   },
// ],
// "payment_method": "COD",
// "room": "",
// "time": "22/8/2020 20:14",
// "totalPrice": 100,}

router.get("/:id", async (req, res) => {
  const foodItems = await FoodItem.find({ _id: req.params.id });
  console.log(foodItems);
  res.status(200).send(foodItems);
});

module.exports = router;
