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
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
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
    title: Joi.string().required(),
    hall: Joi.number().required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
  });

  // return Joi.validate(foodItem, schema);
  console.log(foodItem);
  return schema.validate(foodItem);
}

exports.FoodItem = FoodItem;
exports.validate = validateItem;
