const { FoodItem, validate } = require("../models/foodItem");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
const _ = require("lodash");

const multer = require("multer");
const upload = multer({ dest: "upload/" });

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "anam",
  api_key: "531277261252188",
  api_secret: "YWc1GhUuPcOFDGapf-mhpGWo6co",
});

// router.get("/", async (req, res) => {
//   const foodItems = await FoodItem.find().sort("hall");
//   let arr = [];
//   for (let i = 0; i < foodItems.length; i++) {
//     arr.push(foodItems[i].hall);
//   }
//   arr = [...new Set(arr)];
//   res.send(arr);
// });

router.get("/:hall", async (req, res) => {
  const foodItems = await FoodItem.find({ hall: req.params.hall }).sort(
    "category"
  );
  console.log(foodItems);
  res.send(foodItems);
});

router.post("/", [auth, admin, upload.single("image")], async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
  //let foodItem = new FoodItem(req.body);

  //res.send(foodItem);
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
    //res.json({ msg: "yaya" });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ err: 'Something went wrong' });
  }
  //res.send("done thnc");
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
