const mongoose = require('mongoose');

var ReceiptSchema = new mongoose.Schema({
    Account:{
    type:String,
    required:'This field is required.'
    },
    Category:{
      type:String,
      required:'This field is required.'
    },
    Amount:{
      type:Number,
      required:'This field is required.'
    },
    Contents:{
      type:String
    },
    username:{
      type:String
    }
});

var Recipts = module.exports=mongoose.model('Mymanager',ReceiptSchema);
