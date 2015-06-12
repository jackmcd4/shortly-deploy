var mongoose = require('mongoose');

mongoURI = 'mongodb://MongoLab-b:ZHQTYxdwt98rvAqp3p_f4DKBt8kuySVeMAWd4Q5ce.g-@ds036648.mongolab.com:36648/MongoLab-b' || 'mongodb://localhost/shortlydb';
mongoose.connect('mongodb://localhost/shortlydb');

var db = mongoose.connection;

db.on('error', function(err){
  console.log(err);
});

db.once('open', function(){
  console.log('connection is open');
});

module.exports = db;
