var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// Setup where we serve static assets such as images, html files, css, etc.
app.use(express.static('./public'));

// Setup routes
var routes = require('./routes/router');
app.use('/', routes);

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, function() {
	console.log('App listening on port 3000');
});