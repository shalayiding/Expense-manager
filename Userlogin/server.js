// server.js
// Seperating app.js
// and server operations for cleaner code

var app = require('./app');
var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
  console.log('Server listening on ' + port);
});
