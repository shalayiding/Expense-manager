var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//passing to the orginal mongodb Register
var UserSchema = mongoose.Schema(
{
    username:{
      type:String
    },
    password:{
      type:String
    },
    email:{
      type:String
    }
});
//connect to user ->>mongodb
var User=module.exports = mongoose.model('users',UserSchema);




//bcrypt password hash
module.exports.createUser = function(newUser,callback){
    bcrypt.genSalt(10,function(err,salt)
  {
    bcrypt.hash(newUser.password,salt,function(err,hash)
  {
    newUser.password=hash;
    newUser.save(callback);
  });
  });
}

module.exports.getUserByUsername = function(username,callback){//call back function
  var query = { username: username} ;
  User.findOne(query,callback);//pass the qury to mongoose
}

module.exports.getUserById = function(id,callback){//call back function
  User.findById(id,callback);//pass the qury to mongoose
}

module.exports.comparePassword = function(candidatePassword,hash,callback)
{
  bcrypt.compare(candidatePassword,hash,function(err,isMatch) //bcrypt hash back the password
{
  if(err) throw err;
  callback(null,isMatch);
});
}
