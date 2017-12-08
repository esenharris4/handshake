// Setup our database connection and schema for users to login
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id: String
})

module.exports.userSchema = userSchema;