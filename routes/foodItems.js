const { FoodItem, validate } = require("../models/foodItem");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const foodItems = await FoodItem.find().sort("hall");
  console.log(foodItems);
  res.send(foodItems);
});

router.get("/:hall", async (req, res) => {
  const foodItems = await FoodItem.find({ hall: req.params.hall }).sort(
    "class"
  );
  console.log(foodItems);
  res.send(foodItems);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let foodItem = new FoodItem(req.body);
  foodItem = await foodItem.save();

  res.send(foodItem);
});

router.delete("/:id", async (req, res) => {
  const foodItem = await FoodItem.findByIdAndRemove(req.params.id);

  if (!foodItem)
    return res.status(404).send("The item with the given ID was not found.");

  res.send(foodItem);
});

module.exports = router;
