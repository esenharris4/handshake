var express = require('express')
var router = express.Router()
var debug = require('debug')('index')
var passport = require('passport')
var pug = require('pug')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Handshake' })
})

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.redirect('error') }
    req.login(user, function(err) {
        if (err) {
            next(err);
        }
    })
    return res.render('home', {email: req.user._id, friends: req.user.friend_ids}) // ADD IN FRIENDS LIST
  })(req, res, next)
})

router.post('/createUser', function (req, res, next) {
  debug(req.app.db)
  req.app.db.models.User.encryptPassword(req.body.password, function (err, hash) {
  	console.log(req.body.password);
    if (err) {
      debug(err)
      return res.render('error', {message: err})
    }
    var fields = {
      _id: req.body.email,
      password: hash,
      friend_ids: []
    }
    req.app.db.models.User.create(fields, function (err, user) {
      if (err) {
        debug(err)
        return res.render('error', {message: err})
      }
    })
  })
  return res.redirect('/')
})

// ADD AUTHENTICATION REQUIREMENT LATER
// db.users.update({"_id":"exampleUser2@gmail.com"}, {$push: {"friend_ids":"surettej@bu.edu"}});
router.post('/home/addFriend', function(req, res, next) {
	req.app.db.models.User.findById(req.user._id, function (err, user) {
	  if (err){ 
	  	return handleError(err);
	  }

	  req.user.friend_ids.push(req.body.newFriendEmail.toString())
	  user.set({ friend_ids: req.user.friend_ids });
	  user.save(function (err, updatedUser) {
	    if (err) return handleError(err);
	  });
	  res.render('home', {email: req.user._id, friends: req.user.friend_ids})
	});
})

module.exports = router
