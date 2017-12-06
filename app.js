var express = require('express');
var app = express();

// Setup where we serve static assets
app.use(express.static('./public'));

// Setup routes
var routes = require('./routes/router');
app.use('/', routes);

app.listen(3000, function() {
	console.log('App listening on port 3000');
});