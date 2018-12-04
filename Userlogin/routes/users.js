// users.js database connections

var express=require('express');
var router=express.Router();
var bodyParser = require('body-parser');

// Gotta parse things

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

var userSchema = require('../models/userSchema'); // TODO: Need to write schema for db.

// Kinda made it better
/*//get req of home page

router.get('/register',function(req,res)
{
  res.render('register');
});
//login
router.get('/login',function(req,res)
{
  res.render('login');
});
*/

// Gotta get/post

router.post('/register', function (req, res){

  userSchema.create({ // TODO:  Creating DB, need schema for it in /Models

      someInfoStr: req.body.someInfoStr,
      anotherInfoNum: req.body.anotherInfoNum,
      testInfoBoo: req.body.testInfoBoo,
      testInfoDate: req.body.testInfoDate,


  }, function (err, userSchema) {
    if(err)                 // if failed send error
    {
      return res.status(500).send(err);
    }
  });
});

// Right now these can't connect and get stuff
// because the collectionName's are non-existent

router.get('/register', function (req, res) {

    res.render('register');

    // TODO: need to fix collectionNames
    userSchema.find({}, function (err, someCollectionName) {
        if (err) return res.status(500).send("Ooops. Something went wrong.");
        res.status(200).send(someCollectionName);
    });

});

router.get('/login', function (req, res) {

    res.render('login');

    // TODO: need to fix collectionNames
    userSchema.find({}, function (err, someCollectionName) {
        if (err) return res.status(500).send("Ooops. Something went wrong.");
        res.status(200).send(someCollectionName);
    });
});



module.exports=router;
