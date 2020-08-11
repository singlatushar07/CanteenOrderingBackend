const express = require('express'),
http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const hostname = 'localhost';
const port = 3000;

const CustomerSchema = require('./models/CustomerSchema');

const menurouter = require("./Roters/menurouter");

const getmenurouter = require("./Roters/getmenurouter");

const app = express();

const User = require('./models/userschema');
const userroute = require('./Roters/userroute');


const url = 'mongodb+srv://anam2:anam123@cluster0.fw8l5.mongodb.net/<dbname>?retryWrites=true&w=majority';
const connect = mongoose.connect(url,{
     useNewUrlParser: true ,
     useUnifiedTopology: true
});

connect.then((db) => {
    console.log("Connected correctly to server with ",url);
}, (err) => { console.log(err); });


app.use(bodyParser.json());
app.use('/menu',menurouter);
app.use('/signup', userroute);
app.use('/menu',getmenurouter);


const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
