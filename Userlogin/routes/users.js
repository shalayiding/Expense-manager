var express=require('express');
var router=express.Router();
var User = require('../models/user')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//get register
router.get('/register',function(req,res)
{
  res.render('register');
});
//login
router.get('/login',function(req,res)
{
  res.render('login');
});

router.post('/register',function(req,res)
{
  var email=req.body.email;
  var username=req.body.username;
  var password=req.body.password;

//checing the not valid email or emptyness
  req.checkBody('email',' oop! Email is Required!').notEmpty();
  req.checkBody('username',' oop! UserName is Required!').notEmpty();
  req.checkBody('password',' oop! PassWrod is Required!').notEmpty();
  req.checkBody('email','Email is not valid!').isEmail();

      var empty_check=req.validationErrors();
      if(empty_check)
      {
        res.render('register',{
          empty_check:empty_check
        });
      }else{
        //pass from html to the mongodb ( pass to models user.js)
        var newUser= new User({
          username:username,
          email:email,
          password:password
        });

        User.createUser(newUser,function (err,User){
          if(err) throw err;
          console.log(User);
        });

        //flash message for the user and redirect
        req.flash('success_msg','you can login now !')
        res.redirect('/users/login')
      }
});


    //passport
    passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username,function(err,user)
    {
      if(err) throw err;
      if(!user){
        return done(null,false,{message:'Unknown User'});
      }
      User.comparePassword(password,user.password,function(err,isMatch){  //passing password to the function
      if(err) throw err;

      if(isMatch){
        return done(null,user);//is match
      }else{
        return done(null,false,{message: 'Invalid password or Email'})//flash message is on
      }

    });
  });
  }));

  passport.serializeUser(function (user, done) {
	done(null, user.id);
  });
  passport.deserializeUser(function(id,done)
  {
  User.getUserById(id,function(err,user)
  {
  done(err,user);
  });
  });

  //Flash Messages
  router.post('/login',//if user password or email is incorrect redirect to /
  	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
  	function (req, res) {
  		res.redirect('/');
  	});
module.exports = router;
