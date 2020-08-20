const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { number, string } = require("joi");
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
  mobile: {
    type: String,
    default: "4676676767",
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
      hall: this.hall,
      room: this.room,
      mobile: this.mobile,
    },
    process.env.jwtPrivateKey
  );
  return token;
};

var User = mongoose.model("User", RegisterSchema);
mongoose.model("User").ensureIndexes(function (err) {
  console.log("ensure index", err);
});
// RegisterSchema.index(
//   { createdat: 1 },
//   {
//     expireAfterSeconds: 60, // 2 days
//     partialFilterExpression: {
//       isVerified: true,
//     },
//   }
// );

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
