var express=require('express');
var router=express.Router();

//get req of home page

router.get('/register',function(req,res)
{
  res.render('register');
});
//login
router.get('/login',function(req,res)
{
  res.render('login');
});
module.exports=router;
