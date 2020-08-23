const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { number, string } = require("joi");
require("dotenv").config();

// const itemschema = new Schema({
//   id: {
//     type: String,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
// });
const HistorySchema = new Schema({
  hall: {
    type: Number,
    required: true,
  },

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
  quantity: {
    type: Number,
  },
});
const RegisterSchema = new Schema({
  hall: {
    type: String,
    required: true,
  },

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
  room: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    //required: true,
  },
  isAdmin: {
    type: Boolean,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  mobile: {
    type: String,
    default: "4676676767",
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
      room: this.room,
      mobile: this.mobile,
    },
    process.env.jwtPrivateKey
  );
  return token;
};

var User = mongoose.model("User", RegisterSchema);

module.exports = User;
