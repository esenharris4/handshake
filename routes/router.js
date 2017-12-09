var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Include all models for MongoDB
var Models = require('../models');

var urlEnc = bodyParser.urlencoded({ extended: false });

// Default route for home page
router.get('/', function(req, res, next) {
	return res.send('index.html');
});

// Used to handle create user form and enters data into MongoDB
router.post('/createUser', urlEnc, function(req, res) {
	// Create a password salt
	var salt = bcrypt.genSaltSync(10);

	// Salt and hash password
	var hashed = bcrypt.hashSync(req.body.password, salt);

	var User = new Models.User({
		_id: req.body.email,
		password: hashed
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

module.exports = router;