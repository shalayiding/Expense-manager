var express=require('express');
var router=express.Router();

//get req of home page

router.get('/',function(req,res)
{
  res.render('index');
});
module.exports = router;
