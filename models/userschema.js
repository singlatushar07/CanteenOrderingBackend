const mongoose  = require ('mongoose');
const userSchema  = new mongoose.Schema({

    email : {
      type : String,
      unique : true,
      required : true
    },

    password : {
      type : String,
      required : true
    }



});


var Users  = mongoose.model('User', userSchema);


module.exports = Users;
