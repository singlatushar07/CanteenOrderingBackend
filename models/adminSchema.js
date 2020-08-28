const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { number, string } = require("joi");
require("dotenv").config();

const HistorySchema = new Schema({
  isDineIn: {
    type: Boolean,
  },
  items: {
    type: Array,
  },

  payment_method: {
    type: String,
    //required: true,
  },
  room: {
    type: String,
    //required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
  },
});
const RegisterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
  },

  mobile: {
    type: String,
    default: "",
  },
  imagePath: {
    type: String,
  },
  Pending: {
    type: Number,
    default: 0,
  },
  hall: {
    type: String,
    required: true,
  },
  history: [HistorySchema],
});

RegisterSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      name: this.name,
      email: this.email,
      isVerified: this.isVerified,
      hall: this.hall,
      mobile: this.mobile,
      imagePath: this.imagePath,
    },
    process.env.jwtPrivateKey
  );
  return token;
};

var Admin = mongoose.model("Admin", RegisterSchema);

module.exports = Admin;
