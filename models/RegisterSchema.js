const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { number } = require("joi");
require("dotenv").config();
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
  createdat: {
    type: Date,
    default: Date.now,
    expires: 120,
    partialFilterExpression: {
      isVerified: true,
    },
  },
});
RegisterSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      name: this.name,
      email: this.email,
      isVerified: this.isVerified,
    },
    process.env.jwtPrivateKey
  );
  return token;
};
var User = mongoose.model("User", RegisterSchema);
/*
Object {
  "confirmPassword": "gggggggg",
  "email": "a@f.com",
  "hall": "13",
  "name": "Fr",
  "password": "gggggggg",
  "rollNo": "",
  "room": "Vg",
}
58

*/

module.exports = User;
