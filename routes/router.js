var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var debug = require('debug')('index');
//var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Include all models for MongoDB
var Models = require('../models');

var urlEnc = bodyParser.urlencoded({ extended: false });

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
	usernameField: '_id',
	passwordField: 'password',
    passReqToCallback : true
  },
  function(req, username, password, done) {
    User.find({ username: req.body.email }, function (err, user) {
    	console.log(req.body.email);
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		return done(null, user);
    });
  }
));

// Default route for home page
router.get('/', function(req, res, next) {
	return res.send('index.html');
});

router.get('/fail', function(req, res, next) {
	return res.send('test.html');
});

// Used to handle create user form and enters data into MongoDB
router.post('/createUser', urlEnc, function(req, res) {
	// Create a password salt
	/*var salt = bcrypt.genSaltSync(10);

	// Salt and hash password
	var hashed = bcrypt.hashSync(req.body.password, salt);

	var User = new Models.User({
		_id: req.body.email,
		password: hashed
	});*/
	// Temporarily just storing as plaintext for testing purposes CHANGE!!!!
	var User = new User({
		_id: req.body.email,
		password: req.body.password
	});

	User.save(function(err){
		if(err) {
			console.error(err);
		}
		else {
			console.log("Your user has been saved.");
			console.log('welcome, ' + req.body.email);
		}
	})
	res.redirect('/');
});

/* Handle Login POST */
router.post('/login', urlEnc, passport.authenticate('login',{failureRedirect: '/home'}), function(req, res){
  console.log('Auth Sucessful');
  req.flash('sucess','Logged in');
  res.redirect('/');
});

module.exports = router;