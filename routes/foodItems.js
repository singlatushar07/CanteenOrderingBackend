const { FoodItem, validate } = require("../models/foodItem");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
const _ = require("lodash");

const multer = require("multer");
const upload = multer({ dest: "/tmp/upload/" });

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "anam",
  api_key: "531277261252188",
  api_secret: "YWc1GhUuPcOFDGapf-mhpGWo6co",
});

router.get("/:hall", async (req, res) => {
  const foodItems = await FoodItem.find({ hall: req.params.hall }).sort(
    "category"
  );
  console.log(foodItems);
  res.send(foodItems);
});

router.post("/", [auth, admin, upload.single("image")], async (req, res) => {
  console.log(req.file, req.body);
  try {
    const fileStr = req.file.path;
    console.log(req.file.path);
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: `foodItems/hall${req.body.hall}`,
    });
    console.log(uploadResponse.url);
    const foodItem = new FoodItem(
      Object.assign(
        _.pick(req.body, ["title", "hall", "description", "category", "price"]),
        {
          image: uploadResponse.url,
        }
      )
    );
    await foodItem.save();
  } catch (err) {
    console.error(err);
    // res.status(500).send(json({ err: 'Something went wrong' });
  }
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

router.get("/:id", async (req, res) => {
  const foodItems = await FoodItem.find({ _id: req.params.id });
  console.log(foodItems);
  res.status(200).send(foodItems);
});

module.exports = router;
