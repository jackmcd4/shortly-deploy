var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');

var db = require('../app/config');
var User = require('../app/models/user.js');
var Link = require('../app/models/link.js');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, links){
    if (err) console.log(err);
    console.log(links);
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  util.getUrlTitle(uri, function(err, title) {
    if (err) {
      console.log('Error reading URL heading: ', err);
      return res.send(404);
    } else {
      Link.findOne({url: uri}).exec(function(err, searchLink){
        if(err){
          var link = new Link({
            url: uri,
            base_url: req.headers.origin,
            title: title,
            visits: 0
          });
          link.save(function(err, link){
            if(err) return console.log(err);
            res.send(200, newLink);
          });
        }
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log(req.body);

  User.findOne({'username': username}).exec(function(err, user){
    if (!user) {
      console.log("user doesn't exist");
      res.redirect('/login');
    } else {
      user.comparePassword(password, user.password, function(err, match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec(function(err, user){
    if(!user){
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, newUser){
        if(err) return console.log(err);
        util.createSession(req, res, newUser);
      });
    } else {
      res.redirect('/signup');
    }
  })
};

exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0]}).exec(function(err, link){
    if(!link){
     console.log(err);
     res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err, link){
        res.redirect(link.url);
        return;
      });
    }
  });
};
