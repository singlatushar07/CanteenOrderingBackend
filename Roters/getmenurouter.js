const express = require('express');
const bodyParser = require('body-parser');

const getmenurouter = express.Router();
const mongoose = require('mongoose');

const CustomerSchema = require('../models/CustomerSchema');

getmenurouter.use(bodyParser.json());
getmenurouter.route('/:hall')
.get((req,res,next) => {
    res.statusCode = 200;
    //res.send("kjcvbjk");
    CustomerSchema.find({ hall :req.params.hall })
    .then((data)=>{
      console.log(data),
      res.send(data);

    })
    .catch((error)=>{
      console.log(error)
    });
});
module.exports = getmenurouter;
