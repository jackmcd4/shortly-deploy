var mongoose = require('mongoose');

// mongoURI = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/shortlydb';
mongoose.connect('mongodb://localhost/shortlydb');

var db = mongoose.connection;

db.on('error', function(err){
  console.log(err);
});

db.once('open', function(){
  console.log('connection is open');
});

module.exports = db;
