var express=require('express');
var router=express.Router();
var User = require('../models/user')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Recipts = require('../models/recipt')


//get register
router.get('/register',function(req,res)
{
  res.render('register');
});

//get login
router.get('/login',function(req,res)
{
  res.render('login');
});

//MANAGER GET REQ
router.get('/mymanager',function(req,res)//mymanager
{
  res.render("mymanager/addOrEdit",{
    viewTitle: "Expanse Information "
  });
});

router.get('/mymanager/statics',function(req,res){
  Recipts.find({username:req.user.username},function(err,docs){  //get recipts from by find
    if(!err){
      res.render("mymanager/statics",{
        Slist : docs
      });
    }else{
      console.log("error from the line 62 in users.js "+ err);
    }
  });
});





//MANAGER POST res
router.post('/mymanager',function(req,res){
    if(req.body._id == ''){
insertMymanager(req,res);//insert function
    }
 else {
   {
     updataRecord(req,res);
   }
 }
});//call funciton insertMymanager to insert the data to the databse

function insertMymanager(req,res)//insert into the
{
  var recipts = new Recipts();
  recipts.Account=req.body.Account;
  recipts.Category=req.body.Category;
  recipts.Amount=req.body.Amount;
  recipts.Contents=req.body.Contents;
  //key to find the object in other collections
  recipts.username= req.user.username;

  console.log(req.user.username);
  recipts.save((err,doc)=>{
    if(!err){
    res.redirect('mymanager/list')
  }else {
    if(err.name == 'ValidationError'){
      handleValidationError(err,req.body); //function line 67
      res.render('mymanager/addOrEdit',{
        viewTitle : "Expanse Information ",
        recipts : req.body // update the error message
      });
    }
      else
      {
      console.log('error from 42 users.js');
    }
    }
  });
}
//update for the database
function updataRecord(req,res){
  Recipts.findOneAndUpdate({_id:req.body._id},req.body,{new : true },(err,doc)=>{
    if(!err){
      res.redirect('mymanager/list');
    }
    else{
      if(err.name=='ValidationError')
      {
        handleValidationError(err,req.body);
        res.render('mymanager/addOrEdit',{
          viewTitle:'Update Recitps',
          Recitps:req.body
        });
      }
      else{
        console.log('error from update function'+err);
      }
    }
  });
}


//get the list and do the query for username match give list value = docs
router.get('/mymanager/list',function(req,res){
  Recipts.find({username:req.user.username},function(err,docs){  //get recipts from by find
    if(!err){
      console.log('error form line 87');
      res.render("mymanager/list",{
        list : docs
      });
    }else{
      console.log("error from the line 62 in users.js "+ err);
    }
  });
});


//error handlers function
function  handleValidationError(err,body){
  for(field in err.errors)
  {
    switch (err.errors[field].path) {
      case 'Account':
            body['AccountError']=err.errors[field].message;
            break;
      case 'Category':
            body['CategoryError']=err.errors[field].message;
            break;
      case 'Amount':
            body['AmountError']=err.errors[field].message;
        break;
      default:
        break;
    }
  }
}


//post req for the /register
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
        });

        //flash message for the user and redirect
        req.flash('success_msg','you can login now !')
        res.redirect('/users/login')
      }
});



    //passport checking if the user is in the data base or not
    //if yes look for the password hash ismatch or not
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

  //Flash Messages for logout handel
  router.post('/login',//if user password or email is incorrect redirect to /
  	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
  	function (req, res) {
  		res.redirect('/');
  	});



//get for logout
    router.get('/logout',function(req,res){
      req.logout(); //passport logout
      req.flash('success_msg','you are logged out');
      res.redirect('/users/login');

    });


    //update the recipts
    //testing get for params.id 5c116d70c49261455cb91bb0
    router.get('/mymanager/:id',(req,res)=>{
        Recipts.findById(req.params.id, (err,doc)=>{
          if(!err)
          {
            res.render("mymanager/addOrEdit",{
              viewTitle:"Update Recipts",
              recipts : doc
            });
          }
          else{
            console.log(err+"get mymanager/id");
          }
       });
    });

    router.get('/mymanager/delete/:id',(req,res)=>{
        Recipts.findByIdAndRemove(req.params.id,(err,doc)=>{
          if(!err)
          {
            res.redirect('/users/mymanager/list');
          }else{
            throw err;
          }
        });
    });

module.exports = router;
