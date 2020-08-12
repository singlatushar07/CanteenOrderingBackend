const Joi = require("joi");
const mongoose = require("mongoose");

var FoodItem = mongoose.model(
  "FoodItem",
  new mongoose.Schema({
    hall: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    /*image :{
    type : Array,

  },*/
    subTitle: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    class: {
      type: String,
      required: true,
    },
    id: {
      type: String,
    },
  })
);

function validateItem(foodItem) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    hall: Joi.number().required(),
    class: Joi.string(),
    price: Joi.number().min(0).required(),
    subTitle: Joi.string(),
  });

  // return Joi.validate(foodItem, schema);
  console.log(foodItem);
  return schema.validate(foodItem);
}

exports.FoodItem = FoodItem;
exports.validate = validateItem;
