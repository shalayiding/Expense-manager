/*jshint esversion: 6*/

// db.js
// Database connector
// This should be in .gitignore after TODO
// Fixed MongoParserError.
// Fixed UnhandledPromiseRejectionWarning.


var mongoose = require('mongoose');

// TODO : MongoDB URI needed here.

mongoose.connect('mongodb://localhost/someCollectionName' , {useNewUrlParser : true})
        .catch(err => {
          console.error(err);
        });
