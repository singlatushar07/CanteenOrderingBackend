const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
const mongoose = require('mongoose');

const CustomerSchema = require('../models/CustomerSchema');
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.statusCode = 200;

    CustomerSchema.find({ })
    .then((data)=>{
      console.log(data),
      res.send(data);

    })
    .catch((error)=>{
      console.log(error)
    });
})
.post((req, res, next) => {
  //console.log(req.body.hall.value);
  console.log(req.body.hall);
  console.log(req.body.class);
  //const hall = req.body.hall.value;

//  const {image,price,title,hall,subTitle} = req.body;
  //const className = req.body.class;
  try{
  const user = new CustomerSchema (req.body);

  user.save();
  const id = user._id;

  console.log(`{${id}}`);
  //db.menucards.update({"_id":ObjectId(id)},{$set:{"id": id}});

  //res.send(`{id : "${id}"}`);
  res.send(JSON.stringify({ id: id }));
}catch(err){res.statusCode = 422;res.send("bdkjvks")};


})
.put((req, res, next) => {
    res.statusCode = 200;
    CustomerSchema.findOneAndUpdate({_id: req.body.id}, {$set:{id:req.body.id}},function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }

    console.log(doc);
});
  //  CustomerSchema.updateMany({hall : req.body.hall},)
    res.send(JSON.stringify({"status" : "updated"}));
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});

module.exports = dishRouter;
