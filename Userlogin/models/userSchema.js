// userSchema.js user data schema.

var mongoose = require('mongoose');

// Schema is the structure of the collection in the database.

var userSchema = new mongoose.Schema({

  someInfoStr: String,      // Testing
  anotherInfoNum: Number,
  testInfoBoo: Boolean,
  testInfoDate: Date,

});

mongoose.model('userSchema', userSchema);

module.exports = mongoose.model('userSchema');
