var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var Models = require('../models');

var urlEnc = bodyParser.urlencoded({ extended: false });

// Defining actions for each route in our server
router.get('/', function(req, res, next) {
	return res.send('index.html');
});

router.post('/createUser', urlEnc, function(req, res) {
	// POST uses the passed body parsing middleware
	var User = new Models.User({
		_id: req.body.email
	});
	User.save(function(err){
		console.log("Your user has been saved.");
		console.log('welcome, ' + req.body.email);
		if(err) {
			console.error(err);
		}
	})
	res.redirect('/');
});

module.exports = router;