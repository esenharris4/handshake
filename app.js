var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// Set up middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize()); // makes sure we have a user attached to the session --> passport.user
app.use(passport.session());
app.use(flash());

// Setup where we serve static assets such as images, html files, css, etc.
app.use(express.static('./public'));

// Setup routes
var routes = require('./routes/router');
app.use('/', routes);

app.listen(3000, function() {
	console.log('App listening on port 3000');
});