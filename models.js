var mongoose = require("mongoose");
var Users = require("./models/userModel"); // import user schema
mongoose.connect('mongodb://localhost:27017/users');

var db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function(callback){
    console.log("Connection Succeeded."); /* Once the database connection has succeeded, the code in db.once is executed. */
});

var User = mongoose.model("User", Users.userSchema);

module.exports.User = User;