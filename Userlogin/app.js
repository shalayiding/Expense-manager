
// ----------all the model we have to user in main app --------------
var express = require('express');
var path = require('path');
//parser ----------------------------------
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//mongo db ---------------------------------------------
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Register');
var db = mongoose.connection;
//------------------------------------------

//routes creating ---------------------------

var routes = require('./routes/index');
var users = require('./routes/users');

//-----------------------------------------------


//app express------------------------------------
var app=express();
//-------------------------------------------------

//setting the middleware  body parser
app.use(bodyParser.json());//from line 7
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());//from line 6
//-----------------------------------------------


//view engine  ---------------------------------
app.set('views',path.join(__dirname,'views'));//all the views from views folder
app.engine('handlebars',exphbs({defaultLayout:'layout'})); //getting from line 8
app.set('view engine','handlebars');
//--------------------------------------------------------

//setting the resource file for all user call res_public
app.use(express.static(path.join(__dirname,'res_public')));//css and html go here
//-----------------------------------------------------------

// keep password safe when typing  ------------ex sesstion github
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//--------------passport initialize ------------
app.use(passport.initialize());
app.use(passport.session());


//github validator.js
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//--------------------------------------------------


// flash connection  ----------------------------
app.use(flash());


//var to flash -------------------------------
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');//passpost own message
  next();
});


app.use('/',routes);
app.use('/users',users);

//last thing set the post to listen
app.set('port',(process.env.PORT || 3000));
//localhost 3000 is whre port on
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
