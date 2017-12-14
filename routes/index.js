var express = require('express')
var router = express.Router()
var debug = require('debug')('index')
var passport = require('passport')
var pug = require('pug')
var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'squaremailgroups@gmail.com',
		pass: 'bostonuniversity441'
	}
})

router.get('/', function (req, res, next) {
  res.render('index', { title: 'SQUARE MAIL' })
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
      groups: [],
      emailList: []
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
router.post('/home/addGroup', function(req, res, next) {
	req.app.db.models.User.findById(req.user._id, function (err, user) {
	  if (err){
	  	return handleError(err);
	  }

	  req.user.groups.push(req.body.newGroup.toString())
	  req.user.emailList.push([req.body.emails])
	  user.set({ groups: req.user.groups })
	  user.set({ emailList: req.user.emailList })
	  user.save(function (err, updatedUser) {
	    if (err) return handleError(err);
	  });
	  res.render('home', {email: req.user._id, groups: req.user.groups})
	});
})

// Add logic to find the index of the group
router.post('/home/sendMail', function(req, res, next) {
	var emailListIndex = req.user.groups.indexOf(req.body.targetGroup)
	var emailList = req.user.emailList[emailListIndex]
	console.log(emailListIndex + ' ' + emailList)

	const mailOptions = {
		from: req.user._id, // sender address
		to: emailList, // list of receivers
		subject: req.body.subject, // Subject line
		html: req.body.message// plain text body
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if(err) console.log(err)
		else console.log(info);
	});
	res.render('home', {email: req.user._id, friends: req.user.friend_ids})
})

module.exports = router
