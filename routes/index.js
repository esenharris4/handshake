var express = require('express')
var router = express.Router()
var debug = require('debug')('index')
var passport = require('passport')
var flash = require('express-flash')
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
  res.render('index', { title: 'SquareMail' })
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
    return res.render('home', {email: req.user._id, groups: req.user.groups}) // ADD IN FRIENDS LIST
  })(req, res, next)
})

router.get('/home', function(req, res, next) {
	req.flash('info', 'Welcome');
	res.render('home', {email: req.user._id, groups: req.user.groups})
})

router.post('/createUser', function (req, res, next) {
  debug(req.app.db)
  req.app.db.models.User.encryptPassword(req.body.password, function (err, hash) {
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
	  req.user.emailList.push([])
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

	// BCC's users automatically
	const mailOptions = {
		from: req.user._id,
		bcc: emailList,
		subject: req.user.groups[emailListIndex] + ' Group: ' + req.body.subject,
		text: req.body.message + "\n\nSent by " + req.user._id + " via SquareMail"
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if(err) {
			console.log(err)
		}
		else console.log(info);
	});
	res.render('home', {email: req.user._id, groups: req.user.groups})
})

router.get('/groupInfo/:val', function (req, res, next) {
	var emailListIndex = req.user.groups.indexOf(req.params.val)
	var emailList = req.user.emailList[emailListIndex]
	console.log(emailList)
	console.log(emailListIndex)

	if(req.user.emailList.length == 0){
	  res.render('groupInfo', {groupName: req.params.val, emailList: ['Your group looks empty!'], userName: req.user._id})
	}
    else {
	  res.render('groupInfo', {groupName: req.params.val, emailList: req.user.emailList[emailListIndex], userName: req.user._id})
	}
})

router.post('/add/:val', function(req, res, next) {

	// Locate the user in the database by their primary key (ie: email)
	req.app.db.models.User.findById(req.user._id, function (err, user) {

	  if (err){
	  	return handleError(err)
	  }

	  var emailListIndex = req.user.groups.indexOf(req.params.val)

	  // Error check email to be sure a valid email has been entered
	  var emailEnding = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	  // If no error was found, push the email, or list of emails, into the database of the corresponding group
	  var newEmailArray = req.body.newEmail.split(",")
	  console.log(newEmailArray +"\n")

	  for(var i = 0; i < newEmailArray.length; i++) {

	  	if(emailEnding.test(newEmailArray[i].trim())) {
	  	
	  		console.log(newEmailArray[i]) //DELETE
		  	// Add the email into the database
		  	var emailList = req.user.emailList[emailListIndex].push(newEmailArray[i].trim())
		
		}

	  }

	  // Append new email list to the callback object in Mongo
	  user.set({ emailList: req.user.emailList })

	  user.save(function (err, updatedUser) {
	    if (err) return handleError(err);
	  })

	  if(req.user.emailList.length == 0){
	  	res.render('groupInfo', {groupName: req.params.val, emailList: [], userName: req.user._id})
	  }
	  else {
	  	res.render('groupInfo', {groupName: req.params.val, emailList: req.user.emailList[emailListIndex], userName: req.user._id})
	  }

	});

})

router.post('/delete/:val', function(req, res, next) {
	req.app.db.models.User.findById(req.user._id, function (err, user) {
	  if (err){
	  	return handleError(err);
	  }

	  var emailListIndex = req.user.groups.indexOf(req.params.val)
	  if(req.body.email == ""){
	  	res.render('groupInfo', {groupName: req.params.val, emailList: req.user.emailList[emailListIndex], userName: req.user._id})
	  	return
	  }
	  var emailList = req.user.emailList[emailListIndex]
	  var newEmailList = []

	  for(var i = 0; i<emailList.length; i++) {
	  	if(emailList[i] != req.body.email) {
	  		newEmailList.push(emailList[i])
	  	}
	  }
	  console.log(newEmailList + ' ' + emailListIndex)
	  req.user.emailList[emailListIndex] = newEmailList

	  user.set({ emailList: req.user.emailList })
	  user.save(function (err, updatedUser) {
	    if (err) return handleError(err);
	  })
	  if(req.user.emailList.length == 0){
	  	res.render('groupInfo', {groupName: req.params.val, emailList: ['Your group looks empty!'], userName: req.user._id})
	  }
	  else {
	  	res.render('groupInfo', {groupName: req.params.val, emailList: req.user.emailList[emailListIndex], userName: req.user._id})
	  }
	});
})

router.post('/nukeGroup/:val', function(req, res, next) {
	req.app.db.models.User.findById(req.user._id, function (err, user) {
	  if (err){
	  	return handleError(err);
	  }

	  var emailListIndex = req.user.groups.indexOf(req.params.val)

	  var emailArr = req.user.emailList.filter(function(elem, index, array) {
		        return array.indexOf(elem) !== emailListIndex;
		    }
		);

	  var groupsArr = req.user.groups.filter(function(elem, index, array) {
		        return array.indexOf(elem) !== emailListIndex;
		    }
		);

	  console.log(groupsArr + '\n')
	  console.log(emailArr +'\n\n')

	  user.set({ emailList: emailArr })
	  user.set({ groups: groupsArr })
	  user.save(function (err, updatedUser) {
	    if (err) return handleError(err);
	  })

	  res.render('home', {email: req.user._id, groups: groupsArr})
	});
})

router.get('/logout', function(req, res, next) {
	req.logout()
	res.render('index', { title: 'SquareMail' })
})

module.exports = router
