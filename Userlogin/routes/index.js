var express=require('express');
var router=express.Router();

//get req of home page

router.get('/',function(req,res)
{
  res.render('index');
});

function ensureAuthenticated(req,res){  //ensure the authenticated member only access the web
if(req.inAuthenticated()){
  return next();
}
  else{
    res.redirect('/users/login');
  }
}
module.exports = router;
