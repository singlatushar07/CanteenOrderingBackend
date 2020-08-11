const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const HallSchema = new Schema  ({
  label :{
    type : String
  },
  value :{
    type : Number
  }
});
const MenuCardschema = new Schema ({
//  hall :  HallSchema,

    hall : {
      type : Number,
      required : true
    },

  title :{
    type : String,
    required : true,
  },

  /*image :{
    type : Array,

  },*/

  subTitle  :{
    type : String,
    required : true,
  },
  price : {
    type : String
  }
  ,class : {
    type : String
  }
  ,id : {
    type : String
  }
});
var CustomerSchema = mongoose.model('MenuCard', MenuCardschema);
/*
{
Object {
  "class": "C",
  "description": "CCTV",
  "hall": Object {
    "label": "Hall 8",
    "value": 8,
  },
  "image": Array [],
  "price": "88",
  "title": "C",

  class: "Snacks",
  id: "Snacks3",
  title: "food3",
  image: require("../assets/burger.jpg"),
  price: 10,
  subTitle: "Cheakcn lidec",
}

*/

module.exports = CustomerSchema;
