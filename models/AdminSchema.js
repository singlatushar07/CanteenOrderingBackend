const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const HistorySchema = new Schema({
  userId: {
    type: String,
  },
  isDelivery: {
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
    default: Date.now(),
  },
  totalPrice: {
    type: Number,
  },
  orderStatus: {
    type: Number,
    default: 0,

    //   0: pending action
    //   1: rejected
    //   2: accepted
  },
});
const AdminSchema = new Schema({
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
  mobile: {
    type: String,
    default: "",
  },
  imagePath: {
    type: String,
  },
  expoNotificationToken: {
    type: String,
    default: null,
  },
  history: [HistorySchema],
  pending: [HistorySchema],
});

AdminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      hall: this.hall,
      mobile: this.mobile,
      imagePath: this.imagePath,
      isAdmin: true,
    },
    process.env.jwtPrivateKey
  );
  return token;
};

var Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
